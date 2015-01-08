import random
import time

import swi

class Server(swi.SimpleWebInterface):
    serve_dirs = ['static']

    def swi(self):
        return open('index.html').read()

    def ws_graph(self, client, id):
        offset = 'abcd'.index(id)
        while True:
            client.write('%g' % (random.random() + 10*offset))
            time.sleep(0.01)



port = 8080
swi.browser(port=port)
swi.start(Server, port=port)
