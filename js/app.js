$("#btn_validate").click( function () {
  $("#warnings").html("");
  $("#errors").html("");
  $("#results").html("");
  
  validate(editor.getValue(), function (feedback) {
    $.each(feedback.warnings, function (index, warning) {
      $("#warnings").append($('<li id="warning' + index + '">').text(warning));
    });
    
    $.each(feedback.errors, function (index, error) {
      $("#errors").append($('<li id="error' + index + '">').text(error));
    });

    if (feedback.errors.length === 0 && feedback.warnings.length === 0) {
      $("#results").append("Congrats! Your syntax is correct.");
    }
  });
});

var editor = CodeMirror.fromTextArea(document.getElementById("ta_turtle"), {
    lineNumbers: true,
    mode: 'turtle',
    viewportMargin: Infinity,
    theme: 'default'
});

var example = `@prefix rdfs: <https://www.w3.org/2000/01/rdf-schema#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns> .


#defining a Class
<http://example.com/City> a rdfs:Class ;
	rdfs:label "City" ;
	rdfs:comment "A permanent settled place with administratively defined boundaries." ;
	rdfs:subClassOf <http://example.com/Place> .

#defining an Object Property (range is an URI)
<http://example.com/capital_of> a rdf:Property ;
	rdfs:label "is capital of" ;
	rdfs:comment "The relationship between a city and a country as its capital city." ;
	rdfs:subPropertyOf <http://example.com/city_of> ;
	rdfs:domain <http://example.com/City> ;
	rdfs:range <http://example.com/Country> .

#defining a Data Property (range is a Literal)
<http://example.com/has_name> a rdf:Property ;
	rdfs:label "has name" ;
	rdfs:comment "The property defining the name of a thing." ;
	rdfs:domain <http://example.com/Thing> ;
	rdfs:range rdfs:Literal .`;

$("#btn_example").click( function () {
editor.setValue(example);
});

$("#btn_download").click( function () {
var textToWrite = editor.getValue();
var textToWrite = textToWrite.replace(/\n/g, "\r\n");
var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
var fileNameToSaveAs = "FILENAME.ttl";
var downloadLink = document.createElement("a");
downloadLink.download = fileNameToSaveAs;
downloadLink.innerHTML = "Turtle Web Editor Content";
window.URL = window.URL || window.webkitURL;
downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
downloadLink.onclick = destroyClickedElement;
downloadLink.style.display = "none";
document.body.appendChild(downloadLink);
downloadLink.click();
});

function destroyClickedElement(event) {
document.body.removeChild(event.target);
}

var dropZone = document.body;

function getExtension(filename) {
  var parts = filename.split('.');
  return parts[parts.length - 1];
}

function isTTL(filename) {
  var ext = getExtension(filename);
  switch (ext.toLowerCase()) {
      return true;
  }
  return false;
}

// Get file data on drop
dropZone.addEventListener('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();
    var files = e.dataTransfer.files; // Array of all files

    for (var i=0, file; file=files[i]; i++) {
        if (isTTL(file)) {
            var reader = new FileReader();
	    reader.addEventListener(
		    "load",
		    () => {
		     editor.setValue(reader.result);
		    },
		    false
		  );
            reader.readAsText(file)
        }
    }
});
