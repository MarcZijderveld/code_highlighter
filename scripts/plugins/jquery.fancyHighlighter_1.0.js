//Settings variable
var settings;

//Collections of all the keywords that need to be highlighted.
var operator = ["var ", "console", "this", "extends", "int ", "integer ", "string ", "double ", "byte ", "int32 ", "int16 ", "array ", "if", "else", "for", "while", "each", "new", "bool", "true", "false"],
    nonKeyword = [";", "}", "{"],
    method = ["function", "void", "public", "private", "interface", "abstract", "class"];

(function ($)
{
    $.fn.fancyHighlighter = function (options)
    {
        //Cache the text area.
        var textArea = $(this);

        //Default options for the highlighter
        var defaults =
        {
            fontFamily: "Inconsolata",
            fontSize: "10px",
            //Colors
            nonKeyword: "#000000",
            operator: "#0000f0",
            method: "#aa00ff",
            numsAndValues: "#990000",
            variables: "#d56000",
            strings: "#777777",
            comments: "#008080",
            //Target of the output
            target: "#output"
        },
        //Methods used by the plugin.
        methods =
        {
            /**
            * Highlight function
            *
            * @param text, settings
            */
            highlight: function (text, settings)
            {
                //Replace comments with regular expressions
                text = text.replace(/\/\/(.*?)\n/g, "<span style='color:" + settings.comments + "'>" + "//$1\n" + "</span>");

                //Replace methods
                text = methods.highlightMultiple(text, method, settings.method);

                //Replace operators
                text = methods.highlightMultiple(text, operator, settings.operator);

                //Replace nonKeyword
                text = methods.highlightMultiple(text, nonKeyword, settings.nonKeyword);

                //Replace Strings with regular expressions.
                text = text.replace(/"(.*?)"/g, "<span style='color:" + settings.strings + "'>" + "'$1'" + "</span>");

                //Return the highlighted text.
                return text;
            },
            /**
            * Highlight function
            *
            * @param text, collection, color
            */
            highlightMultiple: function (text, collection, color)
            {
                //Loop through all the items in the array and highlight them in the text.
                $.each(collection, function (key, value)
                {
                    text = text.replace(new RegExp(value, "g"), "<span style='color:" + color + "'>" + value + "</span>");
                });

                //Return the highlighted text.
                return text;
            }
        };

        //Get the settings from the initialiser.
        settings = $.extend({}, defaults, options);

        //Markup the input div.
        this.css({ fontFamily: settings.fontFamily });
        this.css({ color: settings.color });
        this.css({ fontSize: settings.fontSize });

        //Markup the output div.
        $(settings.target).css({ fontFamily: settings.fontFamily });
        $(settings.target).css({ color: settings.color });
        $(settings.target).css({ fontSize: settings.fontSize });

        //Fill the code variable with the text from the textfield.
        var text = textArea.val();

        //Highlight the initial text.
        $(settings.target).html(methods.highlight(text, settings));
            
        //Bind the onpropertychange even to the text area.
        textArea.bind('input propertychange', function ()
        {
            text = textArea.val();
            $(settings.target).html(methods.highlight(text, settings));
        });

        //Prevent the textarea from skipping the tab button, as this is after all a code editor.
        textArea.keydown(function (e)
        {
            if (e.keyCode == 9)
            { // tab was pressed
                // get tab position/selection
                var start = this.selectionStart;
                var end = this.selectionEnd;

                var $this = $(this);
                var value = $this.val();

                // set textarea value to: text before tab + text after tab
                $this.val(value.substring(0, start)
                            + "\t"
                            + value.substring(end));

                // put tab at right position again (add one for the tab)
                this.selectionStart = this.selectionEnd = start + 1;

                // prevent the focus lose
                e.preventDefault();
            }
        });

        return this;
    };
})(jQuery);

