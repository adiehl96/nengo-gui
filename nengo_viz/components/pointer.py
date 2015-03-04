import nengo
import numpy as np
import struct

from nengo_viz.components.component import Component


class Pointer(Component):
    def __init__(self, viz, obj, **kwargs):
        super(Pointer, self).__init__(viz, **kwargs)
        self.obj = obj
        self.label = viz.viz.get_label(obj)
        self.data = []
        with viz.model:
            output, self.vocab_out = obj.outputs['default']
            input, self.vocab_in = obj.inputs['default']
            self.node = nengo.Node(self.gather_data,
                                   size_in=self.vocab_out.dimensions,
                                   size_out=self.vocab_in.dimensions)
            self.conn1 = nengo.Connection(output, self.node, synapse=0.01)
            self.conn2 = nengo.Connection(self.node, input, synapse=None)

    def remove_nengo_objects(self, viz):
        viz.model.connections.remove(self.conn1)
        viz.model.connections.remove(self.conn2)
        viz.model.nodes.remove(self.node)

    def gather_data(self, t, x):

        vocab = self.vocab_out
        m = np.dot(vocab.vectors, x)
        matches = [(mm, vocab.keys[i]) for i, mm in enumerate(m) if mm > 0.01]
        text = ';'.join(['%0.2f%s' % (sim, key) for (sim, key) in matches])

        msg = '%g %s' % (t, text)
        self.data.append(msg)
        return self.vocab_in.parse('0').v

    def update_client(self, client):
        while len(self.data) > 0:
            data = self.data.pop(0)
            client.write(data, binary=False)

    def javascript(self):
        return ('new VIZ.Pointer({parent:main, sim:sim, '
                'x:%(x)g, y:%(y)g, label:%(label)s, '
                'width:%(width)g, height:%(height)g, id:%(id)d, '
                '});' %
                dict(x=self.x, y=self.y, width=self.width, height=self.height,
                     id=id(self), label=`self.label`,
                     ))
