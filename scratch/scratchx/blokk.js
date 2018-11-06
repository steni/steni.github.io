(function (ext) {
    var bulbs = null;  // An array of bulbs
    var bulbNames = [];

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'name bulb %s', 'get_bulb', '65561'],
            [' ', 'turn lights %m.lightSwitchState', 'setLightSwitchState', 'on'],
            [' ', 'turn light %m.lights', 'setLightSwitchState', 'on']
        ],
        menus: {
            lightSwitchState: ['on', 'off'],
            lessMore: ['<', '>'],
            eNe: ['=', 'not ='],
            lights: bulbNames.push("steni")
        },
        url: 'https://github.com/steni/lys',
        displayName: 'IKEA Trådfri'
    };

    // Register the extension
    ScratchExtensions.register('IKEA Tradfri', descriptor, ext);

    if (bulbs == null) {
        $.ajax({
            url: 'https://127.0.0.1:8443/bulbs',
            dataType: 'json',
            success: function (bulbs_data) {
                console.log("returned from /bulbs)");
                console.log(bulbs_data);
                console.log(Object.values(bulbs_data));

                $.each(bulbs_data, function(key, value){
                    console.log(value["name"]) ;
                    bulbNames.push(value["name"]);
                });

                console.log("bulb names " + bulbNames.toString());
                bulbs = bulbs_data;
            }
        });
    }

    // Cleanup function when the extension is unloaded
    ext._shutdown = function () {
    };

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function () {
        return {status: 2, msg: 'Ready'};
    };

    ext.get_bulb = function (bulbId, callback) {
        // Make an AJAX call to get the specific bulb
        $.ajax({
            url: 'https://127.0.0.1:8443/bulb/' + bulbId,
            dataType: 'json',
            success: function (bulb_data) {
                bulbName = bulb_data['name'];
                callback(bulbName);
            }
        });
    };

    ext.setLightSwitchState = function (lightSwitchState) {
        console.log(lightSwitchState);
        var url = "https://127.0.0.1:8443/bulbs/" + lightSwitchState;
        console.log("posting to " + url);
        // Make an AJAX call to set all bulbs
        $.ajax({
            url: url,
            dataType: 'json',
            success: function (bulb_data) {
                console.log("return from switching all bulbs to " + lightSwitchState);
                console.log(bulb_data);
            }
        });
    };
})({});