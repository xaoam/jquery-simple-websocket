describe('jQuery Simple Web Socket', function() {
    var simpleWebSocket;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000; // 1min

    beforeEach(function() {
        simpleWebSocket = $.simpleWebSocket({ url: 'ws://127.0.0.1:3000/' });
    });

    afterEach(function() {
        simpleWebSocket.close();
    });

    it('connects to nodejs server', function(done) {
        simpleWebSocket.connect().done(function() {
            expect(simpleWebSocket.isConnected()).toBe(true);
            done();
        }).fail(function(e) {
            expect(true).toBe(false);
            done();
        });
    });


    it('receives echo msg from nodejs server', function(done) {
        simpleWebSocket.connect().done(function() {
            expect(simpleWebSocket.isConnected()).toBe(true);

            simpleWebSocket.listen(function(data) {
                expect(data.msg).toBe('hello echo');
                done();
            }).fail(function() {
                expect(true).toBe(false);
                done();
            });
            simpleWebSocket.send({'msg': 'hello echo'});


        }).fail(function(e) {
            expect(true).toBe(false);
            done();
        });
    });


    it('reconnects', function(done) {

        simpleWebSocket.connect().done(function() {
            expect(simpleWebSocket.isConnected()).toBe(true);

            simpleWebSocket.send({'cmd': 'spawnFiveMinServer'}).done(function() {
                console.log('reconnect test');
                simpleWebSocket.close();
                delayedWebSocket = $.simpleWebSocket({ url: 'ws://127.0.0.1:3001/' });

                delayedWebSocket.connect().done(function() {
                    console.log('reconnected');
                    expect(simpleWebSocket.isConnected()).toBe(true);
                    done();
                }).fail(function() {
                    console.log('reconnection failed');
                    expect(true).toBe(false);
                    done();
                });
            });
        }).fail(function(e) {
            expect(true).toBe(false);
            done();
        });

    });

});
