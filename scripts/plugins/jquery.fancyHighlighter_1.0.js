(function ($)
{
	//Settings variable
	var settings;

	//Collections of all the keywords that need to be highlighted.
	var operator = ["using", "return", "float", "var ", "console", "this", "extends", "int ", "integer ", "string ", "double ", "byte ", "int32 ", "int16 ", "array ", "if", "else", "for", "while", "each", "new", "bool", "true", "false"],
		nonKeyword = [";", "}", "{"],
		method = ["static", "protected", "function", "void", "public", "private", "interface", "abstract", "class"];	
		
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
            highlight: function (input, settings)
            {
                //Replace methods
                input = methods.highlightMultiple(input, method, settings.method);

                //Replace operators
                input = methods.highlightMultiple(input, operator, settings.operator);

                //Replace nonKeyword
                input = methods.highlightMultiple(input, nonKeyword, settings.nonKeyword);

                //Replace Strings with regular expressions.
                input = input.replace(/"(.*?)"/g, "<span style='color:" + settings.strings + "'>" + "'$1'" + "</span>");
				
				//Replace comments with regular expressions
                input = input.replace(/\/\/(.*?)\n/g, "<span style='color:" + settings.comments + " !important;'>" + "//$1\n" + "</span>");

                //Return the highlighted text.
                return input;
            },
            /**
            * Highlight function
            *
            * @param text, collection, color
            */
            highlightMultiple: function (text2, collection, color)
            {
                //Loop through all the items in the array and highlight them in the text.
                $.each(collection, function (key, value)
                {
                    text2 = text2.replace(new RegExp(value, "g"), "<span style='color:" + color + "'>" + value + "</span>");
                });

                //Return the highlighted text.
                return text2;
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
            
		//console.log("moo");	
			
        //Bind the onpropertychange event to the text area.
        $(document).on('change keyup paste, .input', function (event)
        {
            text = textArea.val();
			//console.log(textArea);
			//console.log(textArea.text());			
            $(settings.target).html(methods.highlight(text, settings));
        });

		//console.log("bla");
		
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

