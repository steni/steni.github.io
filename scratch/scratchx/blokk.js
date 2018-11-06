(function (ext) {

    var bulbs = null;  // An array of bulbs
    var bulbNames = [];
    var bulbIds = [];

    /**
     * Pre-fetch bulbs to populate menu with bulb names
     */
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
                    console.log("---" + value["id"]) ;
                    bulbNames.push(value["name"]);
                    bulbIds.push(value["id"]);
                });

                console.log("bulb names " + bulbNames.toString());
                bulbs = bulbs_data;
            }
        });
    }

    /**
     * Block and block menu descriptions
     */
    var descriptor = {
        blocks: [
            ['R', 'name bulb %m.lightIds', 'get_bulb', bulbIds[0]],
            [' ', 'turn lights %m.lightSwitchState', 'setLightSwitchStates', 'on'],
            [' ', 'turn light %m.lights %m.lightSwitchState', 'setLightSwitchState', bulbNames[0], 'on']
        ],
        menus: {
            lightSwitchState: ['on', 'off'],
            lessMore: ['<', '>'],
            eNe: ['=', 'not ='],
            lights: bulbNames
            ,lightIds: bulbIds
        },
        url: 'https://github.com/steni/lys',
        displayName: 'IKEA Trådfri'
    };

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function () {
        return {status: 2, msg: 'Ready'};
    };

    /**
     * get the specific bulb and return its name
     * @param bulbId - the bulb's id
     * @param callback - the function to callback with the name
     */
    ext.get_bulb = function (bulbId, callback) {
        $.ajax({
            url: 'https://127.0.0.1:8443/bulb/' + bulbId,
            dataType: 'json',
            success: function (bulb_data) {
                bulbName = bulb_data['name'];
                callback(bulbName);
            }
        });
    };

    /**
     * set state (on/off) for one bulb (by name or id)
     * @param bulbId - name or id of bulb
     * @param lightSwitchState - on or off
     */
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

    /**
     * Turn all lights on or off
     * @param lightSwitchState - on / off
     */
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