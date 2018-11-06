(function (ext) {

    var bulbs = null;  // An array of bulbs
    var bulbNames = [];

    if (bulbs == null) {
        $.ajax({
            url: 'https://127.0.0.1:8443/bulbs',
            dataType: 'json',
            async: false,
            success: function (bulbs_data) {
                console.log("returned from /bulbs)");
                console.log(bulbs_data);

                $.each(bulbs_data, function(key, value){
                    console.log(value["name"]) ;
                    bulbNames.push(value["name"]);
                });

                console.log("bulb names " + bulbNames.toString());
                bulbs = bulbs_data;
            }
        });
    }
    
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'name bulb %s', 'get_bulb', '65561'],
            [' ', 'turn lights %m.lightSwitchState', 'setLightSwitchStates', 'on'],
            [' ', 'turn light %m.lights %m.lightSwitchState', 'setLightSwitchState', bulbNames[0], 'on']
        ],
        menus: {
            lightSwitchState: ['on', 'off'],
            lessMore: ['<', '>'],
            eNe: ['=', 'not ='],
            lights: bulbNames
        },
        url: 'https://github.com/steni/lys',
        displayName: 'IKEA Trådfri'
    };

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function () {
        return {status: 2, msg: 'Ready'};
    };

    ext.get_bulb = function (bulbId, callback) {
        // get the specific bulb
        $.ajax({
            url: 'https://127.0.0.1:8443/bulb/' + bulbId,
            dataType: 'json',
            success: function (bulb_data) {
                bulbName = bulb_data['name'];
                callback(bulbName);
            }
        });
    };

    // set state (on/off) in one lightSwitch
    ext.setLightSwitchState = function (bulbId, lightSwitchState) {
        console.log(bulbId + ': ' + lightSwitchState);
        var url = "https://127.0.0.1:8443/bulb/" + bulbId + "/" + lightSwitchState;
        console.log("posting to " + url);
        $.ajax({
            url: url,
            dataType: 'json',
            success: function (bulb_data) {
                console.log("return from switching bulb " +bulbId + " to " + lightSwitchState);
                console.log(bulb_data);
            }
        });
    };

    ext.setLightSwitchStates = function (lightSwitchState) {
        console.log(lightSwitchState);
        var url = "https://127.0.0.1:8443/bulbs/" + lightSwitchState;
        console.log("posting to " + url);
        // Make async call to set all bulbs on or off
        $.ajax({
            url: url,
            dataType: 'json',
            success: function (bulb_data) {
                console.log("return from switching all bulbs to " + lightSwitchState);
                console.log(bulb_data);
            }
        });
    };

    // Register the extension
    ScratchExtensions.register('IKEA Tradfri', descriptor, ext);


    // Cleanup function when the extension is unloaded
    ext._shutdown = function () {
    };

})({});