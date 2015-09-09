$(function () {

    var NotGuardadas = {};

    (function (app) {

        // variables definidas 
        var $title = $('#title'),
			$note = $('#note'),
			$ul = $('#notesList'),
			li = '<li><a href="#pgNotesDetail?title=LINK">ID</a></li>',
			notesHdr = '<li data-role="list-divider">Sus notas</li>',
			noNotes = '<li id="noNotes">No hay notas</li>';

        app.init = function () {
            app.bindings();
            app.checkForStorage();
        };

        app.bindings = function () {
            // funcion agregar nota
            $('#btnAddNote').on('click', function (e) {
                e.preventDefault();

                // Guardar nota
                app.addNote(
					$('#title').val(),
					$('#note').val()
				);
            });

            $(document).on('click', '#notesList a', function (e) {
                e.preventDefault();
                var href = $(this)[0].href.match(/\?.*$/)[0];
                var title = href.replace(/^\?title=/, '');
                app.loadNote(title);
            });
            $(document).on('click', '#btnDelete', function (e) {
                e.preventDefault();
                var key = $(this).data('href');
                app.deleteNote(key);
            });
        };

         app.loadNote = function (title) {
            // Ver notas
            var notes = app.getNotes(),
				
				note = notes[title],
				page = ['<div data-role="page" data-url="details" data-add-back-btn="true">',
							'<div data-role="header">',
								'<h1>NotGuardadas</h1>',
								'<a id="btnDelete" href="" data-href="ID" data-role="button" class="ui-btn-right">Borrar</a>',
							'</div>',
							'<div data-role="content"><h3>TITLE</h3><p>NOTE</p></div>',
						'</div>'].join('');
            var newPage = $(page);
            //append it to the page container
            newPage.html(function (index, old) {
                return old
						.replace(/ID/g, title)
						.replace(/TITLE/g, title
						.replace(/-/g, ' '))
						.replace(/NOTE/g, note);
            }).appendTo($.mobile.pageContainer);
            $.mobile.changePage(newPage);
        };

        app.addNote = function (title, note) {
            var notes = localStorage['NotGuardadas'],
				notesObj;
            if (notes === undefined || notes === '') {
                notesObj = {};
            } else {
                notesObj = JSON.parse(notes);
            }
            notesObj[title.replace(/ /g, '-')] = note;
            localStorage['NotGuardadas'] = JSON.stringify(notesObj);
            // clear the two form fields
            $note.val('');
            $title.val('');
            //update the listview
            app.displayNotes();
        };

        app.getNotes = function () {
            // get notes
            var notes = localStorage['NotGuardadas'];
            // convert notes from string to object
            return JSON.parse(notes);
        };

        app.displayNotes = function () {
            // get notes
            var notesObj = app.getNotes(),
				// create an empty string to contain html
				html = '',
				n; // make sure your iterators are properly scoped
            // loop over notes
            for (n in notesObj) {
                html += li.replace(/ID/g, n.replace(/-/g, ' ')).replace(/LINK/g, n);
            }
            $ul.html(notesHdr + html).listview('refresh');
        };

        app.deleteNote = function (key) {
            // get the notes from localStorage
            var notesObj = app.getNotes();
            // delete selected note
            delete notesObj[key];
            // write it back to localStorage
            localStorage['NotGuardadas'] = JSON.stringify(notesObj);
            // return to the list of notes
            $.mobile.changePage('index.html');
            // restart the storage check
            app.checkForStorage();
        };

        app.checkForStorage = function () {
            var notes = app.getNotes();
            // are there existing notes?
            if (!$.isEmptyObject(notes)) {
                // yes there are. pass them off to be displayed
                app.displayNotes();
            } else {
                // nope, just show the placeholder
                $ul.html(notesHdr + noNotes).listview('refresh');
            }
        };

        app.init();

    })(NotGuardadas);
});