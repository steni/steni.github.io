(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.get_bulb = function(bulbId, callback) {
        // Make an AJAX call to the Open Weather Maps API
        $.ajax({
            url: 'https://127.0.0.1:8443/bulb/'+bulbId,
            dataType: 'json',
            success: function( bulb_data ) {
                // Got the data - parse it and return the temperature
                bulbName = bulb_data['name'];
                callback(bulbName);
            }
        });
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'name bulb %s', 'get_bulb', '65561']
        ]
    };

    // Register the extension
    ScratchExtensions.register('IKEA Tradfri', descriptor, ext);
})({});