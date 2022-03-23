window.onload = init;


var dataNames = [
    "pe25.json",
    "pe2j.json"
]
var groupNames =[]
var currentGroupNames = []


function init() {
    // for (let i = 0; i < dataNames.length; i++) {
    //     loadData(dataNames[i]);
    // }

    loadAgData("assets/data/azubis.xml");
    loadAgData("assets/data/studis.xml");
    generateCheckboxes();

}

function loadData(filename){
    let request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (request.readyState == 4 && request.status == 200){
            let azubis = JSON.parse(request.responseText);
            for (let i = 0; i< azubis.length; i  ++){
                data.push(azubis[i]);
                let p = document.createElement("p");
                let textNode = document.createTextNode("Vorname: " + azubis[i].firstname +
                    " Nachname: " + azubis[i].lastname);
                p.appendChild(textNode);
                // document.getElementById("Azubis").appendChild(p);
                // console.log(data);
            }
        }
    }
    request.open("GET", "assets/data/"+filename, true);
    request.send(null);
}

function loadAgData(url) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (request.readyState == 4 && request.status == 200){
            let azubis = request.responseXML;
            // for (let i = 0; i< azubis.length; i  ++){
            //     agData.push(azubis[i]);
            //     console.log(agData);
            // }

            let startKnoten= azubis.children[0];
            let groups = startKnoten.children;
            for (let i = 0; i< groups.length; i  ++){
                let group = groups[i].firstElementChild;

                let groupName = groups[i].nodeName;
                console.log(groups[i].childElementCount);
                countGroups(groupName);

                for (let j = 0; j< groups[i].childElementCount; j ++){

                    let lastname= group.firstElementChild.textContent;
                    let firstname= group.firstElementChild.nextElementSibling.textContent;

                    let azubi = {
                        "firstname" : firstname,
                        "lastname" : lastname,
                        "group" : groupName,
                    }
                    data.push(azubi);

                    if (group.nextElementSibling !== null) {
                        group = group.nextElementSibling;
                    }
                }

            }
            console.log(data);

            if (url === "assets/data/studis.xml"){
                generateCheckboxes();
            }
        }

    }
    request.open("GET", url, true);
    request.send(null);

}

function generate() {
    if (selection.length === 0){
        console.log( "kein Gewinner übrig" );
        printWinner( "kein Gewinner übrig" );
    } else {
        let winner = random().firstname;
        console.log( winner );
        printWinner( winner );
    }
}

function random() {
    if (selection.length === 0){
        return null;
    } else {
        let person = selection[Math.floor( Math.random() * (selection.length) )];
        if (person === lastPerson) {
            person = random()
        }
        lastPerson = person;
        if (document.getElementById( 'del' ).checked) {
            selection = selection.filter( item => item !== person );
            console.log( selection );
        }
        return person;
    }
}

function printWinner(winner) {
    document.getElementById('winner').innerText = winner;
}

function selectData() {
    reset();
    let azubiSellection = [];
    if (document.getElementById('grp' + '1').checked){
        azubiSellection.push('Azubis_2021');
    }
    if (document.getElementById('grp2').checked){
        azubiSellection.push('Studis_2021');
    }
    for (let i = 0; i < azubiSellection.length; i++) {
        for (let j = 0; j < data.length; j++) {
            if (azubiSellection[i] === data[j].group){
                selection.push(data[j]);
            }
        }
    }
    console.log(selection);
}


function selectDataOfAll() {
    reset();
    let azubiSellection = [];
    for (let i = 0; i < currentGroupNames.length; i++) {
        if (document.getElementById('cb' + i).checked){
            azubiSellection.push(document.getElementById('cb' + i).attributes[2].value);
        }
    }
    for (let i = 0; i < azubiSellection.length; i++) {
        for (let j = 0; j < data.length; j++) {
            if (azubiSellection[i] === data[j].group){
                selection.push(data[j]);
            }
        }
    }
    console.log(selection);
}


function reset() {
    selection = [];
    lastPerson = null;
}

function countGroups(group) {
    groupNames.push(group);
    console.log(groupNames);
}

function generateCheckboxes() {
    hideOld();
    for (let i = 0; i < currentGroupNames.length; i++) {
        let id = 'cb' + i;

        let input = document.createElement("input");
        input.id = id;
        input.type = "checkbox";
        input.name = currentGroupNames[i];

        let lable = document.createElement("lable");
        let textNode = document.createTextNode(currentGroupNames[i].replace("_"," "));
        lable.appendChild(textNode);
        lable.setAttribute("for",id);

        console.log(currentGroupNames[i].split("_")[0]);

        if (currentGroupNames[i].split("_")[0] === "Studis") {
            document.getElementById( "cbStudis" ).appendChild( input );
            document.getElementById( "cbStudis" ).appendChild( lable );
        } else {
            document.getElementById( "cbAzubis" ).appendChild( input );
            document.getElementById( "cbAzubis" ).appendChild( lable );
        }
    }
}

function hideOld() {
    console.log("Hidden");
    let date = new Date().getFullYear();
    for (let i = 0; i < groupNames.length; i++) {
        if (!(groupNames[i].split("_")[1] < date-5)){
            currentGroupNames.push(groupNames[i]);
        }
            console.log(date);

    }
}