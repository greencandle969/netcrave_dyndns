var fs       = require('fs');
var inwx     = require('inwx');
var config   = require('./config.js');
var ifconfig = require('ifconfig.me');

/*
 * INWX API documentation is available @ https://www.inwx.de/en/help/apidoc
 */
inwx(
    {
        api:      config.api,
        user:     config.user,
        password: config.password
    },
    function(api)
    {
        ifconfig.getIP(
            function(ip)
            {
                config.dns.forEach(
                    function(el)
                    {
                        el.content = ip;
                        var domain = el.domain;
                        // this can't be included in the request because
                        // the recipient schema will error out if the
                        // request contains undefined parameters.
                        // The domain is included in the request but not
                        // in this object:
                        delete(el.domain);

                        api.nameserverRecordHelper(
                            domain,
                            "delete",
                            el,
                            function(response)
                            {
                                console.log(response);

                                api.nameserverRecordHelper(
                                    domain,
                                    "create",
                                    el,
                                    function(response)
                                    {
                                        console.log(response);
                                    });
                            });
                    });
            },
            function(error)
            {
                console.log(error);
            });

    });
