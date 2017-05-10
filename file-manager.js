// Include fs module
var fs = require("fs");
var prompt = require("prompt");

function useStdin() {
	var input = process.stdin.read();

	if (input === null) {
		return;
	}

	// convert to string, trim whitespace, split to array of words
	var inputSplit = input.toString().trim().split(" ");

	if (inputSplit[0] === "cat") {
		 catFile(inputSplit[1]);
	} else if (inputSplit[0] === "touch") {
		touchFile(inputSplit[1]);
	} else if (inputSplit[0] === "rm"){
		removeFile(inputSplit[1]);
	} else if (inputSplit[0] === "replace"){
		replacePhrase(inputSplit[1],inputSplit[2],inputSplit[3])
	} else if(inputSplit[0] === "grep"){
		findLinesInFile(inputSplit[1], inputSplit[2]);
	}
}

process.stdin.on("readable", useStdin);

//logs the contents of the specified file
function catFile(fileName) {
	fs.readFile(fileName, function(err, data) {
		if (err) {
			console.log(err);
			return;
		}
		console.log(data.toString());
	});
}

//Appends nothing to file and logs message
function touchFile(fileName) {
	fs.appendFile(fileName, "", function(err) {
		if (err) {
			console.log(err);
			return;
		}

		console.log("Touched file!");
	});
}

//Removes the specified file
function removeFile(fileName){
	//prompt user to confirm deletion
	console.log("Are you sure you want to delete this file (y/n)?:")
	prompt.get(["confirm"],function(error, result){
		if(result.confirm === 'y'){
			fs.unlink(fileName,function(err) {
				if (err) {
					console.log(err);
					return;
				}
			});
			console.log("Removed " + fileName);
		}
		else{
			console.log("Did not remove file");	
		}

	});

}

//Searches through a specified file and replaces a phrase if it is found
function replacePhrase(fileName, phraseToReplace, replacementPhrase){
	//Read file in and save to var, replace phrase in file, rewrite file
	fs.readFile(fileName, function(err, data) {
		if (err) {
			console.log(err);
			return;
		}
		//Replace the phrase
		var updatedFileData = data.toString().replace(phraseToReplace, replacementPhrase);
		//Update the file by overwriting it with new data
		fs.writeFile(fileName,updatedFileData, function(err, data) {
			if (err) {
				console.log(err);
				return;
			}
		});
		console.log("Replaced " + phraseToReplace + " with " + replacementPhrase);
	});
}

//Find the line numbers where a phrase exists in a specified file
function findLinesInFile(fileName, phraseToFind){
	//load in the file contents
	fs.readFile(fileName, function(err, data) {
		if (err) {
			console.log(err);
			return;
		}
		//break file data into lines
		var linesOfFile = data.toString().split('\n');

		//loop through each line and search for phrase, if found, note line number
		for(var lineCount = 0; lineCount < linesOfFile.length; lineCount++){
			if(linesOfFile[lineCount].search(phraseToFind) !== -1){
				console.log(lineCount + 1);
			}
		}		
	});
}

function errorHandler(err){
	if (err) {
		console.log(err);
		return;
	}
}



/*
Your assignment is to implement the following functionality:
	* remove a file
		"rm" <file name>
		> rm hello.txt
			entirely delete the file hello.txt

	* find and replace a word in the file
		"replace" <file to search> <word to replace> <replacement word>
		> replace hello.txt hello goodbye
			replace all instances of hello in hello.txt with goodbye
		> replace what.txt there their
			replace all instances of there in what.txt with their

	* find a line in a file
		"grep" <file name> <word to find>
		> grep hello.txt hello
			print out all of the lines in hello.txt that contain "hello"
		> grep what.txt there
			print out all of the lines in what.txt that contain "there"

	Bonus work:
		* Ask for confirmation before deleting a file
		* Don't let people delete files that are above the current working directory (i.e. disallow "../")
		* Have grep take a regular expression as the word to find
		* Create mkdir and rmdir
*/

