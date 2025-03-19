var container = document.getElementById("array");
    // Calling generatearray function
    generatearray();
          // Function to generate the array of blocks
    function generatearray() {
        for (var i = 0; i < 20; i++) {
        // Return a value from 1 to 100 (both inclusive)
        var value = Math.ceil(Math.random() * 100); // raw value

        // Creating element div
        var array_ele = document.createElement("div");

        // Adding class 'block' to div
        array_ele.classList.add("block"); // block from css file

        // Adding style to div
        // _.style is modifing the properties
        array_ele.style.height = `${value * 3}px`; // the hight of bar showen in web site
        array_ele.style.transform = `translate(${i * 30}px)`; //space between bar

        // Creating label element for displaying
        // size of particular block
        var array_ele_label = document.createElement("label");
        array_ele_label.classList.add("block_id"); // labal from css file
        array_ele_label.innerText = value; // add text on web site

        // Appending created elements to index.html
        array_ele.appendChild(array_ele_label);
        container.appendChild(array_ele);
        }
    }

    // Asynchronous LinearSearch function
    // call when click the search button
    async function LinearSearch(delay = 300) {
        // input block data
        var blocks = document.querySelectorAll(".block");

        //Extracting the value entered by the user
        // input data 
        var target = document.getElementById("fname").value;

        // output data
        var output = document.getElementById("text");

        //Changing the color of all the blocks to voilet
        for (var i = 0; i < blocks.length; i += 1) {
            blocks[i].style.backgroundColor = "#6b5b95";
        }

        output.innerText = "Processing...";

        var flag = 0;
        // LinearSearch Algorithum
        for (var i = 0; i < blocks.length; i += 1) {
            //Changing the color of current block to red
            blocks[i].style.backgroundColor = "#FF4949";

            // To wait for .1 sec
            await new Promise((resolve) =>
            setTimeout(() => {
                resolve();
            }, delay)
            );

            //Extracting the value of current block
            var value = Number(blocks[i].childNodes[0].innerHTML);

            // To compare block value with entered value
            if (value == target) {
                flag = 1;
                output.innerText = "Element Found";

                blocks[i].style.backgroundColor = "#13CE66";
                break;
            } else {
                // Changing the color to the previous one
                blocks[i].style.backgroundColor = "#6b5b95";
            }
        }
        //When element is not found in the array
            if (flag == 0) {
              output.innerText = "Element Not Found";
        }
    }