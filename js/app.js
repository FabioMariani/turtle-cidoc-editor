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

var example = `@prefix crm: <http://www.cidoc-crm.org/cidoc-crm/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

<https://linked.art/example/object/20> a crm:E22_Human-Made_Object ;
    rdfs:label "Simple Example Painting" ;
    crm:P2_has_type <http://vocab.getty.edu/aat/300033618>,
        <http://vocab.getty.edu/aat/300133025> .

<http://vocab.getty.edu/aat/300033618> a crm:E55_Type ;
    rdfs:label "Painting" .

<http://vocab.getty.edu/aat/300133025> a crm:E55_Type ;
    rdfs:label "Work of Art" .`;

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
