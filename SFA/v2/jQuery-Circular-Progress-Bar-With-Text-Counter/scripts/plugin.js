(function ($) {

    var methods = {
        init: function (options) {
            // Default options
            var settings = $.extend({
                color: "#000000",
                height: "300px",
                width: "300px",
                line_width: 8,
                starting_position: 25,
                percent: 100,
                counter_clockwise: false,
                percentage: true,
                text: ''
            }, options);

            // Store instance-specific settings
            $(this).data('circularProgressSettings', settings);

            // Create percentage
            var percentage = $("<div class='progress-percentage'></div>");
            if (!settings.percentage) {
                percentage.text(settings.percentage);
            }
            $(this).append(percentage);

            // Create text
            var text = $("<div class='progress-text'></div>");
            if (settings.text != "percent") {
                text.text(settings.text);
            }
            $(this).append(text);

            // Apply settings
            $(this).css({
                "height": settings.height,
                "width": settings.width
            });
            $(this).addClass("circular-progress-bar");

            // Remove old canvas and add new one
            $(this).find("canvas").remove();
            $(this).append(createCanvas($(this)));

            return this;
        },
        percent: function (value) {
            var settings = $(this).data('circularProgressSettings');
            settings.percent = value;

            // Apply settings
            $(this).css({
                "height": settings.height,
                "width": settings.width
            });

            // Remove old canvas and add new one
            $(this).children("canvas").remove();
            $(this).append(createCanvas($(this)));

            return this;
        },
        animate: function (value, time) {
            var settings = $(this).data('circularProgressSettings');

            $(this).css({
                "height": settings.height,
                "width": settings.width
            });

            var num_of_steps = time / 10;
            var percent_change = (value - settings.percent) / num_of_steps;

            var scope = $(this);
            var theInterval = setInterval(function () {
                if (settings.percent < value) {
                    scope.children("canvas").remove();
                    settings.percent += percent_change;
                    scope.append(createCanvas(scope));
                } else {
                    clearInterval(theInterval);
                }
            }, 10);

            return this;
        }
    };

    $.fn.circularProgress = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            // Method found
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init", object passed in or nothing passed in
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist.');
        }
    };

    /* =========================================================================
        PRIVATE FUNCTIONS
    ========================================================================= */

    // Return string without 'px' or '%'
    function removeUnit(apples) {
        if (apples.indexOf("px")) {
            return apples.substring(0, apples.length - 2);
        } else if (apples.indexOf("%")) {
            return apples.substring(0, apples.length - 1);
        }
    }

    // Return string with 'px'
    function appendUnit(apples) {
        if (apples.toString().indexOf("px") < 0 && apples.toString().indexOf("%") < 0) {
            return apples += "px";
        }
    }

    // Calculate starting position on canvas
    function calcPos(apples, percent) {
        if (percent < 0) {
            // Calculate starting position
            var starting_degree = (parseInt(apples) / 100) * 360;
            var starting_radian = starting_degree * (Math.PI / 180);
            return starting_radian - (Math.PI / 2);
        } else {
            // Calculate ending position
            var ending_degree = ((parseInt(apples) + parseInt(percent)) / 100) * 360;
            var ending_radian = ending_degree * (Math.PI / 180);
            return ending_radian - (Math.PI / 2);
        }
    }

    // Insert percentage or custom text inside progress circle
    function insertText(scope, settings) {
        scope.find(".progress-percentage").text(Math.round(settings.percent) + "%");
    }

    // Create canvas
    function createCanvas(scope) {
        var settings = scope.data('circularProgressSettings');
    
        // Remove 'px' or '%' from dimensions
        var canvasHeight = parseInt(settings.height);
        var canvasWidth = parseInt(settings.width);
    
        // Create canvas
        var canvas = document.createElement("canvas");
        canvas.height = canvasHeight;
        canvas.width = canvasWidth;
    
        // Get canvas context
        var ctx = canvas.getContext("2d");
        ctx.lineWidth = settings.line_width;
    
        // Calculate radius and center coordinates
        var xCenter = canvasWidth / 2;
        var yCenter = canvasHeight / 2;
        var radius = Math.min(xCenter, yCenter) - settings.line_width;
    
        // Draw background arc (unfilled portion)
        ctx.strokeStyle = "#e0e0e0"; // Color for the unfilled portion
        ctx.beginPath();
        ctx.arc(xCenter, yCenter, radius, 0, 2 * Math.PI, false); // Full circle
        ctx.stroke();
    
        // Draw progress arc (filled portion)
        ctx.strokeStyle = settings.color; // Color for the filled portion
        ctx.beginPath();
        var startingAngle = -0.5 * Math.PI; // Start at the top (12 o'clock position)
        var endingAngle = startingAngle + (2 * Math.PI * settings.percent / 100); // End based on percentage
        ctx.arc(xCenter, yCenter, radius, startingAngle, endingAngle, settings.counter_clockwise);
        ctx.stroke();
    
        // Add text if enabled
        if (settings.percentage) {
            insertText(scope, settings);
        }
    
        return canvas;
    }
    

}(jQuery));
