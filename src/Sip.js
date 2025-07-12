import React, { useState, useEffect, useRef } from 'react';

const Sip = () => {
  const canvasRef = useRef(null);
  const [circles, setCircles] = useState([
    { lineCount: 0, radius: 450, directionCount: 0, rotationAngle: 0, showCircle: true, show360Numbers: true, id: 1 },
    { lineCount: 0, radius: 400, directionCount: 0, rotationAngle: 0, showCircle: true, show360Numbers: false, id: 2 },
    { lineCount: 0, radius: 350, directionCount: 0, rotationAngle: 0, showCircle: true, show360Numbers: false, id: 3 },
  ]);
  const [areCirclesVisible, setAreCirclesVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [isImageVisible, setIsImageVisible] = useState(true);
  const [show360Numbers, setShow360Numbers] = useState(true);
  const [canvasVisible, setCanvasVisible] = useState(false);
  const [squareWidth, setSquareWidth] = useState(900);
  const [squareHeight, setSquareHeight] = useState(900);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [squareSize, setSquareSize] = useState({ width: 900, height: 900 });
  const [squareSiz, setSquareSiz] = useState({ width: 900, height: 900 });
  const [showSquare, setShowSquare] = useState(false);
  const [squareSizee, setSquareSizee] = useState({ width: 800, height: 800 });
  const [squareSizz, setSquareSizz] = useState({ width: 900, height: 800 });
  const [showSquaree, setShowSquaree] = useState(false);


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    // Declare centerX and centerY variables
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    if (isImageVisible && imageSrc) {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        drawCircles();
      };
    } else {
      drawCircles();
    }


    function drawCircles() {
      circles.forEach((circle) => {
        const {
          lineCount,
          radius,
          showCircle,
          directionCount,
          rotationAngle,
          canvasVisible,
          squareSize,
          show360Numbers: circleShow360Numbers,
        } = circle;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        if (areCirclesVisible && showCircle) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fillStyle = 'black';


          if (show360Numbers && circleShow360Numbers !== undefined && circleShow360Numbers) {
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'black';

            for (let i = 0; i < 360; i += 10) {
              const angle = ((i * Math.PI) / 180) + rotationAngle;
              const textX = centerX + (radius + 20) * Math.cos(angle);
              const textY = centerY + (radius + 20) * Math.sin(angle);

              ctx.fillText(i.toFixed(0), textX, textY);
            }
          }

          for (let i = 0; i < lineCount; i++) {
            const angle = ((i * 2 * Math.PI) / lineCount) + rotationAngle;
            const lineEndX = centerX + radius * Math.cos(angle);
            const lineEndY = centerY + radius * Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(lineEndX, lineEndY);
            ctx.stroke();
          }

          if (directionCount > 0) {
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            for (let i = 0; i < directionCount; i++) {
              const angle = (((i * 2 * Math.PI) / directionCount) + rotationAngle) % (2 * Math.PI);
              const textX = centerX + (radius + 20) * Math.cos(angle);
              const textY = centerY + (radius + 20) * Math.sin(angle);
              const directionLabel = getDirectionLabel(i, directionCount);

              ctx.fillText(directionLabel, textX, textY);
            }
          }
        }
      });


      if (canvasVisible) {
        const centerX = canvas.width / 2 - squareWidth / 2 + dragOffset.x;
        const centerY = canvas.height / 2 - squareHeight / 2 + dragOffset.y;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.strokeRect(centerX, centerY, squareWidth, squareHeight);
        ctx.stroke();
        ctx.strokeStyle = 'red';


        // Draw additional lines inside the square
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        // Calculate cell width and height
        const cellWidth = squareWidth / 9;
        const cellHeight = squareHeight / 9;

        ctx.fillStyle = 'black';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';

        // Draw vertical lines and add numbers
        for (let i = 1; i < 9; i++) {
          const x = centerX + i * cellWidth;
          ctx.beginPath()
          ctx.moveTo(x, centerY);
          ctx.lineTo(x, centerY + squareHeight);
          ctx.stroke();

          // Add number in every column
          const columnNumber = i + 0; // Adjust the logic for numbering as per your requirements

          ctx.fillText(columnNumber.toString(), x - cellWidth / 2, centerY + squareHeight / 18);
        }

        for (let i = 6; i >= 0; i--) { // Reverse the loop to start from the highest number
          const x = centerX + i * cellWidth;
          ctx.beginPath();
          ctx.moveTo(x, centerY);
          ctx.lineTo(x, centerY + squareHeight);
          ctx.stroke();

          // Add number in every column
          const columnNumber = 24 - i; // Adjust the logic for numbering to start from the highest number
          ctx.fillText(columnNumber.toString(), x + cellWidth / 0.7, centerY + squareHeight / 1.06);
        }



        // Draw vertical lines and add specific numbers
        const verticalNumbers = [33, 33, 37, 37, 37, 34, 34]; // Define your numbers

        for (let i = 0; i < verticalNumbers.length; i++) {
          const x = centerX + i * cellWidth; // Calculate x position for vertical line
          ctx.beginPath();
          ctx.moveTo(x, centerY); // Start from the top of the canvas
          ctx.lineTo(x, centerY + squareHeight); // Draw to the bottom
          ctx.stroke();

          // Add specific number to the vertical line
          const numberToDisplay = verticalNumbers[i];
          ctx.fillText(numberToDisplay.toString(), x + cellWidth / 0.69, centerY + squareHeight / 6); // Adjust position as needed
        }

        // Draw vertical lines and add specific numbers
        const verticalNumber = [44, 44, 37, 37, 37, 38, 38]; // Define your numbers

        for (let i = 0; i < verticalNumber.length; i++) {
          const x = centerX + i * cellWidth; // Calculate x position for vertical line
          ctx.beginPath();
          ctx.moveTo(x, centerY); // Start from the top of the canvas
          ctx.lineTo(x, centerY + squareHeight); // Draw to the bottom
          ctx.stroke();

          // Add specific number to the vertical line
          const numberToDisplay = verticalNumber[i];
          ctx.fillText(numberToDisplay.toString(), x + cellWidth / 0.69, centerY + squareHeight / 3.6); // Adjust position as needed
        }

        const verticalNumbe = [43, 43, 45, 45, 45, 39, 39]; // Define your numbers

        for (let i = 0; i < verticalNumbe.length; i++) {
          const x = centerX + i * cellWidth; // Calculate x position for vertical line
          ctx.beginPath();
          ctx.moveTo(x, centerY); // Start from the top of the canvas
          ctx.lineTo(x, centerY + squareHeight); // Draw to the bottom
          ctx.stroke();

          // Add specific number to the vertical line
          const numberToDisplay = verticalNumbe[i];
          ctx.fillText(numberToDisplay.toString(), x + cellWidth / 0.69, centerY + squareHeight / 2.6); // Adjust position as needed
        }
        const verticalNumb = [43, 43, 45, 45, 45, 39, 39]; // Define your numbers

        for (let i = 0; i < verticalNumb.length; i++) {
          const x = centerX + i * cellWidth; // Calculate x position for vertical line
          ctx.beginPath();
          ctx.moveTo(x, centerY); // Start from the top of the canvas
          ctx.lineTo(x, centerY + squareHeight); // Draw to the bottom
          ctx.stroke();

          // Add specific number to the vertical line
          const numberToDisplay = verticalNumb[i];
          ctx.fillText(numberToDisplay.toString(), x + cellWidth / 0.69, centerY + squareHeight / 2); // Adjust position as needed
        }
        const verticalNum = [43, 43, 45, 45, 45, 39, 39]; // Define your numbers

        for (let i = 0; i < verticalNum.length; i++) {
          const x = centerX + i * cellWidth; // Calculate x position for vertical line
          ctx.beginPath();
          ctx.moveTo(x, centerY); // Start from the top of the canvas
          ctx.lineTo(x, centerY + squareHeight); // Draw to the bottom
          ctx.stroke();

          // Add specific number to the vertical line
          const numberToDisplay = verticalNum[i];
          ctx.fillText(numberToDisplay.toString(), x + cellWidth / 0.69, centerY + squareHeight / 1.64); // Adjust position as needed
        }
        const verticalNu = [42, 42, 41, 41, 41, 35, 35]; // Define your numbers

        for (let i = 0; i < verticalNu.length; i++) {
          const x = centerX + i * cellWidth; // Calculate x position for vertical line
          ctx.beginPath();
          ctx.moveTo(x, centerY); // Start from the top of the canvas
          ctx.lineTo(x, centerY + squareHeight); // Draw to the bottom
          ctx.stroke();

          // Add specific number to the vertical line
          const numberToDisplay = verticalNu[i];
          ctx.fillText(numberToDisplay.toString(), x + cellWidth / 0.69, centerY + squareHeight / 1.39); // Adjust position as needed
        }
        const verticalN = [36, 36, 41, 41, 41, 35, 35]; // Define your numbers

        for (let i = 0; i < verticalN.length; i++) {
          const x = centerX + i * cellWidth; // Calculate x position for vertical line
          ctx.beginPath();
          ctx.moveTo(x, centerY); // Start from the top of the canvas
          ctx.lineTo(x, centerY + squareHeight); // Draw to the bottom
          ctx.stroke();

          // Add specific number to the vertical line
          const numberToDisplay = verticalN[i];
          ctx.fillText(numberToDisplay.toString(), x + cellWidth / 0.69, centerY + squareHeight / 1.2); // Adjust position as needed
        }
        // Draw horizontal lines and add numbers
        for (let i = 1; i < 9; i++) {
          const y = centerY + i * cellHeight;
          ctx.beginPath();
          ctx.moveTo(centerX, y);
          ctx.lineTo(centerX + squareWidth, y);
          ctx.stroke();

          // Add number in every row
          const rowNumber = 33 - i; // Numbers from 8 to 1
          ctx.fillText(rowNumber.toString(), centerX + cellWidth / 2, y + cellHeight / 2);
        }

        // Draw horizontal lines and add numbers
        for (let i = 1; i < 10; i++) {
          const y = centerY + i * cellHeight;
          ctx.beginPath();
          ctx.moveTo(centerX, y);
          ctx.lineTo(centerX + squareWidth, y);
          ctx.stroke();

          // Add number in every row
          const rowNumber = 8 + i; // Numbers from 1 to 9
          ctx.fillText(rowNumber.toString(), centerX + cellWidth / 0.118, y - cellHeight / 2);
        }


        ctx.fillStyle = 'black';
        ctx.font = '39px Arial';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        // Add custom labels
        const labels = ["अठि", "शेष", "शेष", "मित्र", "मित्र", "मित्र", " इंद्रजय", " इंद्रजय", "मृग"];



        // Calculate label spacing with the height of the square box
        const labelSpacing = squareHeight / labels.length;
        const textX = centerX + cellWidth / 0.67; // Define textX here

        for (let i = 0; i < labels.length; i++) {
          // Calculate label position
          const labelY = centerY + labelSpacing / 1 * i + labelSpacing / 1.2;
          ctx.fillText(labels[i], textX, labelY);
        }



        // Add custom labels
        const label = ["रोग", "पापायक्ष्मा", "शेष", "असुर", "वरुण", "नमस्ते", "सुग्रीव", "दौवारिक", "पितृ"];
        // Calculate label spacing with the height of the square box
        const labelSpacin = squareHeight / label.length;
        const texX = centerX + cellWidth / 2; // Define textX here

        for (let i = 0; i < label.length; i++) {
          // Calculate label position
          const labelY = centerY + labelSpacin / 1 * i + labelSpacin / 1.2;
          ctx.fillText(label[i], texX, labelY);
        }



        // Add custom labels
        const labe = ["मुख्य", "रूद्र ", "रूद्र ", "मित्र", "मित्र", "मित्र", " विष्णु", " विष्णु", "भंगराज"];

        // Calculate label spacing with the height of the square box
        const labelSpaci = squareHeight / labe.length;
        const exX = centerX + cellWidth / 0.4; // Define textX here

        for (let i = 0; i < labe.length; i++) {
          // Calculate label position
          const labelY = centerY + labelSpaci / 1 * i + labelSpaci / 1.2;
          ctx.fillText(labe[i], exX, labelY);
        }
        // Add custom labels
        const labee = ["भल्लाट", "पृथ्वीधर", "पृथ्वीधर", " ब्रह्मा", " ब्रह्मा", " ब्रह्मा", "विवस्वान", "विवस्वान", "गंधर्व"];


        // Calculate label spacing with the height of the square box
        const labelSpacii = squareHeight / labee.length;
        const ttexX = centerX + cellWidth / 0.283; // Define textX here

        for (let i = 0; i < labe.length; i++) {
          // Calculate label position
          const labelY = centerY + labelSpacii / 1 * i + labelSpacii / 1.2;
          ctx.fillText(labee[i], ttexX, labelY);
        }
        // Add custom labels
        const labeee = [" सोम", " पृथ्वीधर", " पृथ्वीधर", "ब्रह्मा", "ब्रह्मा", "ब्रह्मा", "विवस्वान", "विवस्वान", "यम"];


        // Calculate label spacing with the height of the square box
        const labelSpaciii = squareHeight / labeee.length;
        const tttexX = centerX + cellWidth / 0.22; // Define textX here

        for (let i = 0; i < labee.length; i++) {
          // Calculate label position
          const labelY = centerY + labelSpaciii / 1 * i + labelSpaciii / 1.2;
          ctx.fillText(labeee[i], tttexX, labelY);
        }
        // Add custom labels
        const labeeee = ["सर्प", " पृथ्वीधर", " पृथ्वीधर", "ब्रह्मा", "ब्रह्मा", "ब्रह्मा", "विवस्वान", "विवस्वान", "वृस्त्रात"];


        // Calculate label spacing with the height of the square box
        const labelSpaciiii = squareHeight / labeeee.length;
        const ttttexX = centerX + cellWidth / 0.181; // Define textX here

        for (let i = 0; i < labe.length; i++) {
          // Calculate label position
          const labelY = centerY + labelSpaciiii / 1 * i + labelSpaciiii / 1.2;
          ctx.fillText(labeeee[i], ttttexX, labelY);
        }
        // Add custom labels
        const labeer = ["अदिति", "आपयत्स", "आपयत्स", "मरीची", "मरीची", "मरीची", "सविता", "सविता", "वितय"];


        // Calculate label spacing with the height of the square box
        const labelSpaciir = squareHeight / labeer.length;
        const rttexX = centerX + cellWidth / 0.154; // Define textX here

        for (let i = 0; i < labeer.length; i++) {
          // Calculate label position
          const labelY = centerY + labelSpaciir / 1 * i + labelSpaciir / 1.2;
          ctx.fillText(labeer[i], rttexX, labelY);
        }
        // Add custom labels
        const labeerr = [" दिति", "आप", "आप", "मरीची", "मरीची", "मरीची", "सवित्री", "सवित्री", "पूषा"];


        // Calculate label spacing with the height of the square box
        const labelSpaciirr = squareHeight / labeerr.length;
        const rrttexX = centerX + cellWidth / 0.134; // Define textX here

        for (let i = 0; i < labeerr.length; i++) {
          // Calculate label position
          const labelY = centerY + labelSpaciirr / 1 * i + labelSpaciirr / 1.2;
          ctx.fillText(labeerr[i], rrttexX, labelY);
        }
        const labeerrr = ["ईश", "पर्जन्य", "जयंत", "इंद्र", "सूर्य", "सत्य", "भृश", "आकाश", "वायु"];

        // Calculate label spacing with the height of the square box
        const labelSpaciirrr = squareHeight / labeerrr.length;
        const rrrttexX = centerX + cellWidth / 0.118; // Define textX here

        for (let i = 0; i < labeerrr.length; i++) {
          // Calculate label position
          const labelY = centerY + labelSpaciirrr / 1 * i + labelSpaciirrr / 1.2;
          ctx.fillText(labeerrr[i], rrrttexX, labelY);
        }



      }
      // Draw square
      // Set the size of the square
      // Set the size of the square
      if (showSquare) {
        const squareX = centerX - squareSize.width / 2;
        const squareY = centerY - squareSize.height / 2;

        ctx.strokeStyle = 'black';
        ctx.strokeRect(squareX, squareY, squareSize.width, squareSize.height);


        // Calculate the position and size of the second square
        const secondSquareSize = squareSize.width / 3; // Size is half of the width of the larger square
        const secondSquareX = centerX - secondSquareSize / 2;
        const secondSquareY = centerY - squareSize.height / 6; // Center the square vertically with a decreased height

        // Draw the second square
        ctx.strokeStyle = 'black';
        ctx.strokeRect(secondSquareX, secondSquareY, secondSquareSize, squareSize.height / 3);



        // 45-degree line from the center of the second square
        const angl = Math.PI / 4;

        // Calculate the endpoints of the diagonal line
        const starX = centerX - Math.cos(angl) * (1 * squareSize.width / 12);
        const starY = centerY + Math.sin(angl) * (1 * squareSize.height / 4.2);
        const enX = centerX + Math.cos(angl) * (3 * secondSquareSize / -4);
        const enY = centerY + Math.sin(angl) * (2 * squareSize.height / 2.8);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(starX, starY);
        ctx.lineTo(enX, enY);
        ctx.stroke();

        // 45-degree line from the center of the second square
        const angle = Math.PI / 4;

        // Calculate the endpoints of the diagonal line
        const startX = centerX - Math.cos(angle) * (1 * squareSize.width / -10);
        const startY = centerY + Math.sin(angle) * (1 * squareSize.height / 4.2);
        const endX = centerX + Math.cos(angle) * (6 * secondSquareSize / 6);
        const endY = centerY + Math.sin(angle) * (2 * squareSize.height / 2.8);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // 45-degree line from the center of the second square
        const ang = Math.PI / 4;

        // Calculate the endpoints of the diagonal line
        const staX = centerX - Math.cos(angle) * (10 * squareSize.width / -42);
        const staY = centerY + Math.sin(angle) * (1 * squareSize.height / 8.2);
        const eX = centerX + Math.cos(angle) * (12 * secondSquareSize / 5.6);
        const eY = centerY + Math.sin(angle) * (1 * squareSize.height / 3.2);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(staX, staY);
        ctx.lineTo(eX, eY);
        ctx.stroke();
        // 45-degree line from the center of the second square
        const anglee = Math.PI / 4;

        // Calculate the endpoints of the diagonal line
        const starteX = centerX - Math.cos(angle) * (10 * squareSize.width / 42);
        const starteY = centerY + Math.sin(angle) * (-7 * squareSize.height / 60.2);
        const endeX = centerX + Math.cos(angle) * (4.2 * secondSquareSize / -2);
        const endeY = centerY + Math.sin(angle) * (2 * squareSize.height / -4.8);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(starteX, starteY);
        ctx.lineTo(endeX, endeY);
        ctx.stroke();

        const angleee = Math.PI / 4;

        // Calculate the endpoints of the diagonal line
        const starteeX = centerX - Math.cos(angle) * (10 * squareSize.width / 42);
        const starteeY = centerY + Math.sin(angle) * (12 * squareSize.height / 100);
        const endeeX = centerX + Math.cos(angle) * (4.2 * secondSquareSize / -2);
        const endeeY = centerY + Math.sin(angle) * (2 * squareSize.height / 4.8);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(starteeX, starteeY);
        ctx.lineTo(endeeX, endeeY);
        ctx.stroke();

        const angleeee = Math.PI / 4;

        // Calculate the endpoints of the diagonal line
        const starteeeX = centerX - Math.cos(angle) * (16 * squareSize.width / -69);
        const starteeeY = centerY + Math.sin(angle) * (-8 * squareSize.height / 80.2);
        const endeeeX = centerX + Math.cos(angle) * (4.2 * secondSquareSize / 2);
        const endeeeY = centerY + Math.sin(angle) * (2 * squareSize.height / -5.2);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(starteeeX, starteeeY);
        ctx.lineTo(endeeeX, endeeeY);
        ctx.stroke();

        const angleeeee = Math.PI / 4;

        // Calculate the endpoints of the diagonal line
        const starteeeeX = centerX - Math.cos(angle) * (12 * squareSize.width / -100);
        const starteeeeY = centerY + Math.sin(angle) * (-10 * squareSize.height / 42.2);
        const endeeeeX = centerX + Math.cos(angle) * (4.2 * secondSquareSize / 4);
        const endeeeeY = centerY + Math.sin(angle) * (2 * squareSize.height / -2.8);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(starteeeeX, starteeeeY);
        ctx.lineTo(endeeeeX, endeeeeY);
        ctx.stroke();

        const angleeeeee = Math.PI / 4;

        // Calculate the endpoints of the diagonal line
        const starteeeeeX = centerX - Math.cos(angle) * (-2 * squareSize.width / -20);
        const starteeeeeY = centerY + Math.sin(angle) * (-10 * squareSize.height / 42.2);
        const endeeeeeX = centerX + Math.cos(angle) * (-2 * secondSquareSize / 2);
        const endeeeeeY = centerY + Math.sin(angle) * (2 * squareSize.height / -2.8);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(starteeeeeX, starteeeeeY);
        ctx.lineTo(endeeeeeX, endeeeeeY);
        ctx.stroke();
        // Add text to the center of the square with dynamically adjusted font size
        const tex = "ब्रह्मम";
        const fontSize = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(tex, centerX, centerY);

        const tex2 = "स्थान";
        const fontSize2 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSize2}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(tex2, centerX, centerY + squareSize.height / 16.2);

        const textBottomLeft33 = "दक्षिण";
        const fontSizeBottomLeft33 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft33}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom

        // Measure the width of the text
        const textWidth333 = ctx.measureText(textBottomLeft33).width; // Get the width of the text
        const textHeight33 = fontSizeBottomLeft33; // Assuming single line of text

        // Calculate position for the text
        const textX33 = squareX + squareSize.width / 1.08; // Align with the left edge of the square
        const textY33 = squareY + squareSize.height / 2; // Align with the bottom edge of the square

        // Rotate canvas by 180 degreess
        ctx.save();
        ctx.translate(textX33 + textWidth333, textY33); // Translate to the bottom left corner of the square
        ctx.rotate(Math.PI / 2); // Rotate by 180 degrees
        ctx.fillText(textBottomLeft33, 0, 0); // Draw text at rotated position
        ctx.restore(); // Restore canvas to original state

        const textBottomLeft23 = "पशिचम";
        const fontSizeBottomLeft23 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft23}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom

        // Measure the width of the texte
        const textWidth33 = ctx.measureText(textBottomLeft23).width; // Get the width of the text
        const textHeight333 = fontSizeBottomLeft23; // Assuming single line of text

        // Calculate position for the text
        const textX3 = squareX + squareSize.width / 2; // Align with the left edge of the square
        const textY3 = squareY + squareSize.height / 1; // Align with the bottom edge of the square

        // Rotate canvas by 180 degreess
        ctx.save();
        ctx.translate(textX3 + textWidth33, textY3); // Translate to the bottom left corner of the square
        ctx.rotate(Math.PI / 1);
        ctx.fillText(textBottomLeft23, 0, 0); // Draw text at rotated position
        ctx.restore(); // Restore canvas to original state

        const textBottomLeft101 = "ईशान";
        const fontSizeBottomLeft333 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft333}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom

        // Measure the width of the text4
        const textWidth3333 = ctx.measureText(textBottomLeft101).width; // Get the width of the text
        const textHeight3333 = fontSizeBottomLeft333; // Assuming single line of text

        // Calculate position for the text
        const textX333 = squareX + squareSize.width / 16 + -54; // Align with the left edge of the square
        const textY333 = squareY + squareSize.height / 100 + -9; // Align with the bottom edge of the square

        // Rotate canvas by 180 degreess
        ctx.save();
        ctx.translate(textX333 + textWidth3333, textY333); // Translate to the bottom left corner of the square
        ctx.rotate(Math.PI / 0.5); // Rotate by 180 degrees
        ctx.fillText(textBottomLeft101, 0, 0); // Draw text at rotated position
        ctx.restore(); // Restore canvas to original state

        const textBottomLeft104 = "अग्नेय";
        const fontSizeBottomLeft104 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft104}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom

        // Measure the width of the text
        const textWidth3334 = ctx.measureText(textBottomLeft104).width; // Get the width of the text
        const textHeight334 = fontSizeBottomLeft104; // Assuming single line of text

        // Calculate position for the text
        const textX334 = squareX + squareSize.width / 1.3; // Align with the left edge of the square
        const textY334 = squareY + squareSize.height / 100 + -9; // Align with the bottom edge of the square

        // Rotate canvas by 180 degreess
        ctx.save();
        ctx.translate(textX334 + textWidth3334, textY334); // Translate to the bottom left corner of the square
        ctx.rotate(Math.PI / 0.5); // Rotate by 180 degrees
        ctx.fillText(textBottomLeft104, 0, 0); // Draw text at rotated position
        ctx.restore(); // Restore canvas to original state

        const textBottomLeft109 = "नैऋत्य";
        const fontSizeBottomLeft109 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft109}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom

        // Measure the width of the text
        const textWidth33344 = ctx.measureText(textBottomLeft109).width; // Get the width of the text
        const textHeight3344 = fontSizeBottomLeft109; // Assuming single line of text

        // Calculate position for the text
        const textX3344 = squareX + squareSize.width / 1.2; // Align with the left edge of the square
        const textY3344 = squareY + squareSize.height / 1.0; // Align with the bottom edge of the square

        // Rotate canvas by 180 degreess
        ctx.save();
        ctx.translate(textX3344 + textWidth33344, textY3344); // Translate to the bottom left corner of the square
        ctx.rotate(Math.PI / 1); // Rotate by 180 degrees
        ctx.fillText(textBottomLeft109, 0, 0); // Draw text at rotated position
        ctx.restore(); // Restore canvas to original state

        const textBottomLeft108 = "उत्तर";
        const fontSizeBottomLeft108 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft108}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom

        // Measure the width of the text
        const textWidth333444 = ctx.measureText(textBottomLeft108).width; // Get the width of the text
        const textHeight33444 = fontSizeBottomLeft108; // Assuming single line of text

        // Calculate position for the text
        const textX33444 = squareX + squareSize.width / -15; // Align with the left edge of the square
        const textY33444 = squareY + squareSize.height / 1.8; // Align with the bottom edge of the square

        // Rotate canvas by 180 degreess
        ctx.save();
        ctx.translate(textX33444 + textWidth333444, textY33444); // Translate to the bottom left corner of the square
        ctx.rotate(Math.PI / -2); // Rotate by 180 degrees
        ctx.fillText(textBottomLeft108, 0, 0); // Draw text at rotated position
        ctx.restore(); // Restore canvas to original state

        const textBottomLeft122 = "वायव्य";
        const fontSizeBottomLeft122 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft122}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom

        // Measure the width of the text
        const textWidth3335 = ctx.measureText(textBottomLeft122).width; // Get the width of the text
        const textHeight335 = fontSizeBottomLeft122; // Assuming single line of text

        // Calculate position for the text
        const textX335 = squareX + squareSize.width / 16; // Align with the left edge of the square
        const textY335 = squareY + squareSize.height / 1.0; // Align with the bottom edge of the square

        // Rotate canvas by 180 degreess
        ctx.save();
        ctx.translate(textX335 + textWidth3335, textY335); // Translate to the bottom left corner of the square
        ctx.rotate(Math.PI / 1); // Rotate by 180 degrees
        ctx.fillText(textBottomLeft122, 0, 0); // Draw text at rotated position
        ctx.restore(); // Restore canvas to original state

        const textBottomLeft120 = "पूर्व";
        const fontSizeBottomLeft120 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft120}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom

        // Measure the width of the text
        const textWidth33355 = ctx.measureText(textBottomLeft120).width; // Get the width of the text
        const textHeight3355 = fontSizeBottomLeft120; // Assuming single line of text

        // Calculate position for the text
        const textX3355 = squareX + squareSize.width / 2.5; // Align with the left edge of the square
        const textY3355 = squareY - squareSize.height / 80; // Align with the bottom edge of the square

        // Rotate canvas by 180 degreess
        ctx.save();
        ctx.translate(textX3355 + textWidth33355, textY3355); // Translate to the bottom left corner of the square

        ctx.fillText(textBottomLeft120, 0, 0); // Draw text at rotated position
        ctx.restore(); // Restore canvas to original state


        // Add text to the bottom of the square with dynamically adjusted font size
        const textt = "भोजनालय";
        const fontSizee = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizee}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom"; // Align text to the bottom
        ctx.fillText(textt, centerX, centerY + squareSize.height / 3);

        const textt99 = "एयरकंडीशनर";
        const fontSizee99 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizee99}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom"; // Align text to the bottom
        ctx.fillText(textt99, centerX, centerY + squareSize.height / 2.6);

        const textt98 = "पुस्तकालय";
        const fontSizee98 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizee98}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom"; // Align text to the bottom
        ctx.fillText(textt98, centerX, centerY + squareSize.height / 2.3);

        // Add text to the bottom left of the square with dynamically adjusted font size
        const textBottomLeft = "लेखा विभाग";
        const fontSizeBottomLeft = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom
        const textWidt = ctx.measureText(textBottomLeft).width; // Get the width of the text
        const textHeigh = fontSizeBottomLeft; // Assuming single line of text
        ctx.fillText(textBottomLeft, squareX + textWidt / 2.5, squareY + squareSize.height / 2 - textHeigh / 2);

        const textBottomLeft2 = "प्रशासनिक विभाग";
        const fontSizeBottomLeft2 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft2}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom
        const textWidt2 = ctx.measureText(textBottomLeft2).width; // Get the width of the text
        const textHeigh2 = fontSizeBottomLeft; // Assuming single line of text
        ctx.fillText(textBottomLeft2, squareX + textWidt2 / 4, squareY + squareSize.height / 2.2 - textHeigh2 / 2);

        const textBottomLeft3 = "वित्त विभाग";
        const fontSizeBottomLeft39 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft39}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom
        const textWidt3 = ctx.measureText(textBottomLeft3).width; // Get the width of the text
        const textHeigh3 = fontSizeBottomLeft; // Assuming single line of text
        ctx.fillText(textBottomLeft3, squareX + textWidt3 / 2, squareY + squareSize.height / 1.8 - textHeigh3 / 2);

        // Add text to the bottom left of the square with dynamically adjusted font size
        const textBottomLeftt = "पीने का पानी";
        const fontSizeBottomLeftt = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeftt}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom
        const textWidth = ctx.measureText(textBottomLeft).width; // Get the width of the text
        const textHeighh = fontSizeBottomLeft; // Assuming single line of text
        ctx.fillText(textBottomLeftt, squareX + textWidth / 2.5, squareY + squareSize.height / 7 - textHeighh / 2);

        const textBottomLeftt2 = "स्वागत कक्ष";
        const fontSizeBottomLeftt2 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeftt2}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom
        const textWidth2 = ctx.measureText(textBottomLeft2).width; // Get the width of the text
        const textHeighh2 = fontSizeBottomLeft; // Assuming single line of text
        ctx.fillText(textBottomLeftt2, squareX + textWidth2 / 2, squareY + squareSize.height / 5.3 - textHeighh2 / 2);

        const textBottomLeftt3 = "पूजा घर";
        const fontSizeBottomLeftt3 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeftt3}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom
        const textWidth3 = ctx.measureText(textBottomLeft3).width; // Get the width of the text
        const textHeighh3 = fontSizeBottomLeft; // Assuming single line of text
        ctx.fillText(textBottomLeftt3, squareX + textWidth3 / 2, squareY + squareSize.height / 10 - textHeighh3 / 2);

        const textBottomLeftt4 = "भूमिगत टैक";
        const fontSizeBottomLeftt4 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeftt4}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom
        const textWidth4 = ctx.measureText(textBottomLeftt4).width; // Get the width of the text
        const textHeighh4 = fontSizeBottomLeft; // Assuming single line of text
        ctx.fillText(textBottomLeftt4, squareX + textWidth4 / 2.7, squareY + squareSize.height / 4.3 - textHeighh4 / 2);

        // Add text to the bottom left center of the square with dynamically adjusted font size
        const textBottomLefttt = "बिक्री विभाग";
        const fontSizeBottomLefttt = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLefttt}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthh = ctx.measureText(textBottomLefttt).width; // Get the width of the text
        const textHeighhh = fontSizeBottomLefttt; // Assuming single line of text
        ctx.fillText(textBottomLefttt, squareX + textWidthh / 3, squareY + squareSize.height / 1.15 - textHeighhh / 2); // Adjust the position as needed

        const textBottomLefttt2 = "तैयार माल";
        const fontSizeBottomLefttt2 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLefttt2}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthh2 = ctx.measureText(textBottomLefttt2).width; // Get the width of the text
        const textHeighhh2 = fontSizeBottomLefttt; // Assuming single line of text
        ctx.fillText(textBottomLefttt2, squareX + textWidthh2 / 2, squareY + squareSize.height / 1.1 - textHeighhh2 / 2); // Adjust the position as needed

        const textBottomLefttt02 = "भारी वाहनों की";
        const fontSizeBottomLefttt02 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLefttt02}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthh02 = ctx.measureText(textBottomLefttt2).width; // Get the width of the text
        const textHeighhh02 = fontSizeBottomLefttt; // Assuming single line of text
        ctx.fillText(textBottomLefttt02, squareX + textWidthh2 / 2, squareY + squareSize.height / 1.06 - textHeighhh2 / 2); // Adjust the position as needed

        const textBottomLefttt0002 = "पार्किंग";
        const fontSizeBottomLefttt0002 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLefttt0002}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthh002 = ctx.measureText(textBottomLefttt0002).width; // Get the width of the text
        const textHeighhh002 = fontSizeBottomLefttt; // Assuming single line of text
        ctx.fillText(textBottomLefttt0002, squareX + textWidthh2 / 2, squareY + squareSize.height / 1.01 - textHeighhh2 / 2); // Adjust the position as needed

        const textBottomLefttt3 = "शो विन्डो";
        const fontSizeBottomLefttt3 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLefttt3}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthh3 = ctx.measureText(textBottomLefttt3).width; // Get the width of the text
        const textHeighhh3 = fontSizeBottomLefttt; // Assuming single line of text
        ctx.fillText(textBottomLefttt3, squareX + textWidthh3 / 1.7, squareY + squareSize.height / 1.23 - textHeighhh3 / 2); // Adjust the position as needed

        // Add text to the bottom right center of the square with dynamically adjusted font size
        const textBottomRight = "भण्डार";
        const fontSizeBottomRight = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomRight}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr = ctx.measureText(textBottomRight).width; // Get the width of the text
        const textHeightr = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRight, squareX + squareSize.width - textWidthr / 2, squareY + squareSize.height / 2 - textHeightr / 2);

        // Add text to the bottom right of the square with dynamically adjusted font size
        const textBottomRight1 = "केऽटीन, जनरेटर";
        const fontSizeBottomRight1 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomRight1}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr1 = ctx.measureText(textBottomRight1).width; // Get the width of the text
        const textHeightr1 = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRight1, squareX + squareSize.width - textWidthr1 / 6, squareY + squareSize.height / 10 - textHeightr1 / 2);

        const textBottomRight22 = "बिजली के मीटर";
        const fontSizeBottomRight22 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomRight22}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr22 = ctx.measureText(textBottomRight22).width; // Get the width of the text
        const textHeightr22 = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRight22, squareX + squareSize.width - textWidthr22 / 6, squareY + squareSize.height / 7 - textHeightr22 / 2);

        const textBottomRight23 = "हल्के वाहनों की";
        const fontSizeBottomRight23 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomRight23}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr23 = ctx.measureText(textBottomRight23).width; // Get the width of the text
        const textHeightr23 = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRight23, squareX + squareSize.width - textWidthr23 / 6, squareY + squareSize.height / 5.4 - textHeightr23 / 2);

        const textBottomRight223 = "पार्किंग";
        const fontSizeBottomRight223 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomRight223}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr223 = ctx.measureText(textBottomRight223).width; // Get the width of the text
        const textHeightr223 = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRight223, squareX + squareSize.width - textWidthr223 / 2, squareY + squareSize.height / 4.5 - textHeightr223 / 2);


        const textBottomRightb12 = "कच्चा माल";
        const fontSizeBottomRight22b12 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black"
        ctx.font = `${fontSizeBottomRight22b12}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr22b12 = ctx.measureText(textBottomRightb12).width; // Get the width of the text
        const textHeightr22b12 = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRightb12, squareX + squareSize.width - textWidthr22b12 / 2.6, squareY + squareSize.height / 1.17 - textHeightr22b12 / 2);

        const textBottomRightb13 = "प्रबन्धक का कक्ष ";
        const fontSizeBottomRight22b13 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black"
        ctx.font = `${fontSizeBottomRight22b13}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr22b13 = ctx.measureText(textBottomRightb13).width; // Get the width of the text
        const textHeightr22b13 = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRightb13, squareX + squareSize.width - textWidthr22b13 / 4, squareY + squareSize.height / 1.23 - textHeightr22b13 / 2);

        const textBottomRightb14 = "मालिक व मुख्य";
        const fontSizeBottomRight22b14 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black"
        ctx.font = `${fontSizeBottomRight22b14}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr22b14 = ctx.measureText(textBottomRightb14).width; // Get the width of the text
        const textHeightr22b14 = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRightb14, squareX + squareSize.width - textWidthr22b14 / 3.4, squareY + squareSize.height / 1.29 - textHeightr22b14 / 2);

        // middle top

        const textBottomRightb1m = "कूलर";
        const fontSizeBottomRight22b1m = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black"
        ctx.font = `${fontSizeBottomRight22b1m}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr22b1m = ctx.measureText(textBottomRightb1m).width; // Get the width of the text
        const textHeightr22b1m = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRightb1m, squareX + squareSize.width / 1.7 - textWidthr22b1m / 2, squareY + squareSize.height / 12 - textHeightr22b1m / 6);

        const textBottomRightb1m2 = "कम्प्यूटर";
        const fontSizeBottomRight22b1m2 = Math.min(squareSize.width, squareSize.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black"
        ctx.font = `${fontSizeBottomRight22b1m2}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr22b1m2 = ctx.measureText(textBottomRightb1m2).width; // Get the width of the text
        const textHeightr22b1m2 = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRightb1m2, squareX + squareSize.width / 1.6 - textWidthr22b1m2 / 2, squareY + squareSize.height / 8 - textHeightr22b1m2 / 6);


      }

      // Draw square
      // Set the size of the square
      if (showSquaree) {
        const squareX = centerX - squareSizee.width / 2;
        const squareY = centerY - squareSizee.height / 2;

        ctx.strokeStyle = 'black';
        ctx.strokeRect(squareX, squareY, squareSizee.width, squareSizee.height);


        // Calculate the position and size of the second square
        const secondSquareSize = squareSizee.width / 3; // Size is half of the width of the larger square
        const secondSquareX = centerX - secondSquareSize / 2;
        const secondSquareY = centerY - squareSizee.height / 6; // Center the square vertically with a decreased height

        // Draw the second square
        ctx.strokeStyle = 'black';
        ctx.strokeRect(secondSquareX, secondSquareY, secondSquareSize, squareSizee.height / 3);

        // 45-degree line from the center of the second square
        const angl = Math.PI / 4;

        // Calculate the endpoints of the diagonal line
        const starX = centerX - Math.cos(angl) * (1 * squareSizee.width / 12);
        const starY = centerY + Math.sin(angl) * (1 * squareSizee.height / 4.2);
        const enX = centerX + Math.cos(angl) * (3 * secondSquareSize / -4);
        const enY = centerY + Math.sin(angl) * (2 * squareSizee.height / 2.8);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(starX, starY);
        ctx.lineTo(enX, enY);
        ctx.stroke();


        // Calculate the endpoints of the diagonal line
        const star1X = centerX - Math.cos(angl) * (1 * squareSizee.width / 6);
        const star1Y = centerY + Math.sin(angl) * (1 * squareSizee.height / 4.2);
        const en1X = centerX + Math.cos(angl) * (3 * secondSquareSize / -2);
        const en1Y = centerY + Math.sin(angl) * (2 * squareSizee.height / 2.8);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(star1X, star1Y);
        ctx.lineTo(en1X, en1Y);
        ctx.stroke();

        // 45-degree line from the center of the second square
        const angle = Math.PI / 4;

        // Calculate the endpoints of the diagonal line
        const startX = centerX - Math.cos(angle) * (1 * squareSizee.width / -12);
        const startY = centerY + Math.sin(angle) * (1 * squareSizee.height / 4.2);
        const endX = centerX + Math.cos(angle) * (6 * secondSquareSize / 8);
        const endY = centerY + Math.sin(angle) * (2 * squareSizee.height / 2.8);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();



        // Calculate the endpoints of the diagonal line
        const start2X = centerX - Math.cos(angle) * (1 * squareSizee.width / -6);
        const start2Y = centerY + Math.sin(angle) * (1 * squareSizee.height / 4.2);
        const end2X = centerX + Math.cos(angle) * (6 * secondSquareSize / 4);
        const end2Y = centerY + Math.sin(angle) * (2 * squareSizee.height / 2.8);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(start2X, start2Y);
        ctx.lineTo(end2X, end2Y);
        ctx.stroke();


        // Calculate the endpoints of the diagonal line
        const staX = centerX - Math.cos(angle) * (10 * squareSizee.width / -42);
        const staY = centerY + Math.sin(angle) * (1 * squareSizee.height / 6.2);
        const eX = centerX + Math.cos(angle) * (12 * secondSquareSize / 5.6);
        const eY = centerY + Math.sin(angle) * (1 * squareSizee.height / 2.2);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(staX, staY);
        ctx.lineTo(eX, eY);
        ctx.stroke();


        // Calculate the endpoints of the diagonal line
        const sta1X = centerX - Math.cos(angle) * (10 * squareSizee.width / -42);
        const sta1Y = centerY + Math.sin(angle) * (1 * squareSizee.height / 16.2);
        const e1X = centerX + Math.cos(angle) * (12 * secondSquareSize / 5.6);
        const e1Y = centerY + Math.sin(angle) * (1 * squareSizee.height / 6);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(sta1X, sta1Y);
        ctx.lineTo(e1X, e1Y);
        ctx.stroke();
        // 45-degree line from the center of the second square
        const anglee = Math.PI / 4;

        // Calculate the endpoints of the diagonal line
        const starteX = centerX - Math.cos(angle) * (10 * squareSizee.width / 42);
        const starteY = centerY + Math.sin(angle) * (-10 * squareSizee.height / 60.2);
        const endeX = centerX + Math.cos(angle) * (4.2 * secondSquareSize / -2);
        const endeY = centerY + Math.sin(angle) * (2 * squareSizee.height / -3.8);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(starteX, starteY);
        ctx.lineTo(endeX, endeY);
        ctx.stroke();
        // Calculate the endpoints of the diagonal line
        const starte1X = centerX - Math.cos(angle) * (10 * squareSizee.width / 42);
        const starte1Y = centerY + Math.sin(angle) * (-4 * squareSizee.height / 50.2);
        const ende1X = centerX + Math.cos(angle) * (4.2 * secondSquareSize / -2);
        const ende1Y = centerY + Math.sin(angle) * (-1 * squareSizee.height / 4);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(starte1X, starte1Y);
        ctx.lineTo(ende1X, ende1Y);
        ctx.stroke();

        // Calculate the endpoints of the diagonal line
        const starteeX = centerX - Math.cos(angle) * (10 * squareSizee.width / 42);
        const starteeY = centerY + Math.sin(angle) * (10 * squareSizee.height / 140);
        const endeeX = centerX + Math.cos(angle) * (4.2 * secondSquareSize / -2);
        const endeeY = centerY + Math.sin(angle) * (2 * squareSizee.height / 8);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(starteeX, starteeY);
        ctx.lineTo(endeeX, endeeY);
        ctx.stroke();

        // Calculate the endpoints of the diagonal line
        const startee1X = centerX - Math.cos(angle) * (10 * squareSizee.width / 42);
        const startee1Y = centerY + Math.sin(angle) * (12 * squareSizee.height / 80);
        const endee1X = centerX + Math.cos(angle) * (4.2 * secondSquareSize / -2);
        const endee1Y = centerY + Math.sin(angle) * (2 * squareSizee.height / 3.8);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(startee1X, startee1Y);
        ctx.lineTo(endee1X, endee1Y);
        ctx.stroke();
        // Calculate the endpoints of the diagonal line
        const starteeeX = centerX - Math.cos(angle) * (16 * squareSizee.width / -69);
        const starteeeY = centerY + Math.sin(angle) * (-8 * squareSizee.height / 50.2);
        const endeeeX = centerX + Math.cos(angle) * (4.2 * secondSquareSize / 2);
        const endeeeY = centerY + Math.sin(angle) * (2 * squareSizee.height / -3.6);



        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(starteeeX, starteeeY);
        ctx.lineTo(endeeeX, endeeeY);
        ctx.stroke();


        const starteee1X = centerX - Math.cos(angle) * (16 * squareSizee.width / -69);
        const starteee1Y = centerY + Math.sin(angle) * (-8 * squareSizee.height / 120.2);
        const endeee1X = centerX + Math.cos(angle) * (4.2 * secondSquareSize / 2);
        const endeee1Y = centerY + Math.sin(angle) * (2 * squareSizee.height / -8.2);



        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(starteee1X, starteee1Y);
        ctx.lineTo(endeee1X, endeee1Y);
        ctx.stroke();



        // Calculate the endpoints of the diagonal line
        const starteeeeX = centerX - Math.cos(angle) * (12 * squareSizee.width / -70);
        const starteeeeY = centerY + Math.sin(angle) * (-10 * squareSizee.height / 42.2);
        const endeeeeX = centerX + Math.cos(angle) * (4.2 * secondSquareSize / 2.8);
        const endeeeeY = centerY + Math.sin(angle) * (2 * squareSizee.height / -2.8);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(starteeeeX, starteeeeY);
        ctx.lineTo(endeeeeX, endeeeeY);
        ctx.stroke();


        // Calculate the endpoints of the diagonal line
        const starteeee1X = centerX - Math.cos(angle) * (12 * squareSizee.width / -140);
        const starteeee1Y = centerY + Math.sin(angle) * (-10 * squareSizee.height / 42.2);
        const endeeee1X = centerX + Math.cos(angle) * (4.2 * secondSquareSize / 6);
        const endeeee1Y = centerY + Math.sin(angle) * (2 * squareSizee.height / -2.8);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(starteeee1X, starteeee1Y);
        ctx.lineTo(endeeee1X, endeeee1Y);
        ctx.stroke();


        // Calculate the endpoints of the diagonal line
        const starteeeeeX = centerX - Math.cos(angle) * (-2 * squareSizee.width / -12);
        const starteeeeeY = centerY + Math.sin(angle) * (-10 * squareSizee.height / 42.2);
        const endeeeeeX = centerX + Math.cos(angle) * (-2 * secondSquareSize / 1.3);
        const endeeeeeY = centerY + Math.sin(angle) * (2 * squareSizee.height / -2.8);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(starteeeeeX, starteeeeeY);
        ctx.lineTo(endeeeeeX, endeeeeeY);
        ctx.stroke();

        // Calculate the endpoints of the diagonal line
        const starteeeee1X = centerX - Math.cos(angle) * (-2 * squareSizee.width / -29);
        const starteeeee1Y = centerY + Math.sin(angle) * (-10 * squareSizee.height / 42.2);
        const endeeeee1X = centerX + Math.cos(angle) * (-2 * secondSquareSize / 3.3);
        const endeeeee1Y = centerY + Math.sin(angle) * (2 * squareSizee.height / -2.8);

        // Draw the diagonal line
        ctx.beginPath();
        ctx.moveTo(starteeeee1X, starteeeee1Y);
        ctx.lineTo(endeeeee1X, endeeeee1Y);
        ctx.stroke();
        // Add text to the center of the square with dynamically adjusted font size
        const tex = "ऑंगन";
        const fontSize = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(tex, centerX, centerY);


        // Add text to the bottom of the square with dynamically adjusted font size
        const textt = "भोजन कक्ष";
        const fontSizee = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom"; // Align text to the bottom
        ctx.fillText(textt, centerX, centerY + squareSizee.height / 2.2);

        // Add text to the bottom left of the square with dynamically adjusted font size
        const textBottomLeft = "धन भण्डार";
        const fontSizeBottomLeft = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom
        const textWidt = ctx.measureText(textBottomLeft).width; // Get the width of the text
        const textHeigh = fontSizeBottomLeft; // Assuming single line of text
        ctx.fillText(textBottomLeft, squareX + textWidt / 1.4, squareY + squareSizee.height / 2 - textHeigh / 2);

        const textBottomLeft3 = "पशिचम";
        const fontSizeBottomLeft3 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft3}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom

        // Measure the width of the texte
        const textWidth33 = ctx.measureText(textBottomLeft3).width; // Get the width of the text
        const textHeight3 = fontSizeBottomLeft3; // Assuming single line of text

        // Calculate position for the text
        const textX3 = squareX + squareSizee.width / 2; // Align with the left edge of the square
        const textY3 = squareY + squareSizee.height / 1; // Align with the bottom edge of the square

        // Rotate canvas by 180 degreess
        ctx.save();
        ctx.translate(textX3 + textWidth33, textY3); // Translate to the bottom left corner of the square
        ctx.rotate(Math.PI / 1);
        ctx.fillText(textBottomLeft3, 0, 0); // Draw text at rotated position
        ctx.restore(); // Restore canvas to original state


        const textBottomLeft33 = "दक्षिण";
        const fontSizeBottomLeft33 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft3}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom

        // Measure the width of the text
        const textWidth333 = ctx.measureText(textBottomLeft3).width; // Get the width of the text
        const textHeight33 = fontSizeBottomLeft33; // Assuming single line of text

        // Calculate position for the text
        const textX33 = squareX + squareSizee.width / 1.109; // Align with the left edge of the square
        const textY33 = squareY + squareSizee.height / 2; // Align with the bottom edge of the square

        // Rotate canvas by 180 degreess
        ctx.save();
        ctx.translate(textX33 + textWidth333, textY33); // Translate to the bottom left corner of the square
        ctx.rotate(Math.PI / 2); // Rotate by 180 degrees
        ctx.fillText(textBottomLeft33, 0, 0); // Draw text at rotated position
        ctx.restore(); // Restore canvas to original state


        const textBottomLeft3333 = "ईशान";
        const fontSizeBottomLeft333 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft3}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom

        // Measure the width of the text
        const textWidth3333 = ctx.measureText(textBottomLeft3).width; // Get the width of the text
        const textHeight3333 = fontSizeBottomLeft333; // Assuming single line of text

        // Calculate position for the text
        const textX333 = squareX + squareSizee.width / 16 + -54; // Align with the left edge of the square
        const textY333 = squareY + squareSizee.height / 480 + -9; // Align with the bottom edge of the square

        // Rotate canvas by 180 degreess
        ctx.save();
        ctx.translate(textX333 + textWidth3333, textY333); // Translate to the bottom left corner of the square
        ctx.rotate(Math.PI / 0.5); // Rotate by 180 degrees
        ctx.fillText(textBottomLeft3333, 0, 0); // Draw text at rotated position
        ctx.restore(); // Restore canvas to original state


        const textBottomLeft334 = "अग्नेय";
        const fontSizeBottomLeft334 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft3}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom

        // Measure the width of the text
        const textWidth3334 = ctx.measureText(textBottomLeft3).width; // Get the width of the text
        const textHeight334 = fontSizeBottomLeft334; // Assuming single line of text

        // Calculate position for the text
        const textX334 = squareX + squareSizee.width / 1.3; // Align with the left edge of the square
        const textY334 = squareY + squareSizee.height / 480 + -9; // Align with the bottom edge of the square

        // Rotate canvas by 180 degreess
        ctx.save();
        ctx.translate(textX334 + textWidth3334, textY334); // Translate to the bottom left corner of the square
        ctx.rotate(Math.PI / 0.5); // Rotate by 180 degrees
        ctx.fillText(textBottomLeft334, 0, 0); // Draw text at rotated position
        ctx.restore(); // Restore canvas to original state

        const textBottomLeft3344 = "नैऋत्य";
        const fontSizeBottomLeft3344 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft3}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom

        // Measure the width of the text
        const textWidth33344 = ctx.measureText(textBottomLeft3).width; // Get the width of the text
        const textHeight3344 = fontSizeBottomLeft3344; // Assuming single line of text

        // Calculate position for the text
        const textX3344 = squareX + squareSizee.width / 1.2; // Align with the left edge of the square
        const textY3344 = squareY + squareSizee.height / 1.0; // Align with the bottom edge of the square

        // Rotate canvas by 180 degreess
        ctx.save();
        ctx.translate(textX3344 + textWidth33344, textY3344); // Translate to the bottom left corner of the square
        ctx.rotate(Math.PI / 1); // Rotate by 180 degrees
        ctx.fillText(textBottomLeft3344, 0, 0); // Draw text at rotated position
        ctx.restore(); // Restore canvas to original state

        const textBottomLeft33444 = "उत्तर";
        const fontSizeBottomLeft33444 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft3}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom

        // Measure the width of the text
        const textWidth333444 = ctx.measureText(textBottomLeft3).width; // Get the width of the text
        const textHeight33444 = fontSizeBottomLeft33444; // Assuming single line of text

        // Calculate position for the text
        const textX33444 = squareX + squareSizee.width / -10; // Align with the left edge of the square
        const textY33444 = squareY + squareSizee.height / 1.8; // Align with the bottom edge of the square

        // Rotate canvas by 180 degreess
        ctx.save();
        ctx.translate(textX33444 + textWidth333444, textY33444); // Translate to the bottom left corner of the square
        ctx.rotate(Math.PI / -2); // Rotate by 180 degrees
        ctx.fillText(textBottomLeft33444, 0, 0); // Draw text at rotated position
        ctx.restore(); // Restore canvas to original state

        const textBottomLeft335 = "वायव्य";
        const fontSizeBottomLeft335 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft3}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom

        // Measure the width of the text
        const textWidth3335 = ctx.measureText(textBottomLeft3).width; // Get the width of the text
        const textHeight335 = fontSizeBottomLeft335; // Assuming single line of text

        // Calculate position for the text
        const textX335 = squareX + squareSizee.width / 16; // Align with the left edge of the square
        const textY335 = squareY + squareSizee.height / 1.0; // Align with the bottom edge of the square

        // Rotate canvas by 180 degreess
        ctx.save();
        ctx.translate(textX335 + textWidth3335, textY335); // Translate to the bottom left corner of the square
        ctx.rotate(Math.PI / 1); // Rotate by 180 degrees
        ctx.fillText(textBottomLeft335, 0, 0); // Draw text at rotated position
        ctx.restore(); // Restore canvas to original state

        const textBottomLeft3355 = "पूर्व";
        const fontSizeBottomLeft3355 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeft3}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom

        // Measure the width of the text
        const textWidth33355 = ctx.measureText(textBottomLeft3).width; // Get the width of the text
        const textHeight3355 = fontSizeBottomLeft3355; // Assuming single line of text

        // Calculate position for the text
        const textX3355 = squareX + squareSizee.width / 2.5; // Align with the left edge of the square
        const textY3355 = squareY - squareSizee.height / 30; // Align with the bottom edge of the square

        // Rotate canvas by 180 degreess 
        ctx.save();
        ctx.translate(textX3355 + textWidth33355, textY3355); // Translate to the bottom left corner of the square

        ctx.fillText(textBottomLeft3355, 0, 0); // Draw text at rotated position
        ctx.restore(); // Restore canvas to original state


        // Add text to the bottom left of the square with dynamically adjusted font size
        const textBottomLeftt = "पूजा घर ";
        const fontSizeBottomLeftt = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeftt}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom
        const textWidth = ctx.measureText(textBottomLeft).width; // Get the width of the text
        const textHeighh = fontSizeBottomLeft; // Assuming single line of text
        ctx.fillText(textBottomLeftt, squareX + textWidth / 2, squareY + squareSizee.height / 7 - textHeighh / 2);

        const textBottomLeftt3 = "सर्व वस्तु";
        const fontSizeBottomLeftt3 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeftt3}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom
        const textWidth3 = ctx.measureText(textBottomLeft3).width; // Get the width of the text
        const textHeighh3 = fontSizeBottomLeft; // Assuming single line of text
        ctx.fillText(textBottomLeftt3, squareX + textWidth3 / 0.4, squareY + squareSizee.height / 10 - textHeighh3 / 2);

        const textBottomLefttp3 = "भण्डार";
        const fontSizeBottomLefttp3 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeftt3}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom
        const textWidthp3 = ctx.measureText(textBottomLeft3).width; // Get the width of the text
        const textHeighhp3 = fontSizeBottomLeft; // Assuming single line of text
        ctx.fillText(textBottomLefttp3, squareX + textWidthp3 / 0.4, squareY + squareSizee.height / 6 - textHeighhp3 / 1.2);

        const textBottomLeftt4 = " ओषधि गृह";
        const fontSizeBottomLeftt4 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLeftt4}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom"; // Align text to the bottom
        const textWidth4 = ctx.measureText(textBottomLeftt4).width; // Get the width of the text
        const textHeighh4 = fontSizeBottomLeft; // Assuming single line of text
        ctx.fillText(textBottomLeftt4, squareX + textWidth4 / 2.4, squareY + squareSizee.height / 2.9 - textHeighh4 / 2);


        // Add text to the bottom left center of the square with dynamically adjusted font size
        const textBottomLefttt = " रति गृह";
        const fontSizeBottomLefttt = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLefttt}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthh = ctx.measureText(textBottomLefttt).width; // Get the width of the text
        const textHeighhh = fontSizeBottomLefttt; // Assuming single line of text
        ctx.fillText(textBottomLefttt, squareX + textWidthh / 2, squareY + squareSizee.height / 1.4 - textHeighhh / 2); // Adjust the position as needed

        const textBottomLefttt3 = " अन्न भण्डार ";
        const fontSizeBottomLefttt3 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLefttt3}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthh3 = ctx.measureText(textBottomLefttt3).width; // Get the width of the text
        const textHeighhh3 = fontSizeBottomLefttt; // Assuming single line of text
        ctx.fillText(textBottomLefttt3, squareX + textWidthh3 / 2.5, squareY + squareSizee.height / 1.12 - textHeighhh3 / 2); // Adjust the position as needed

        const textBottomLefttt33 = "रोदन गृह ";
        const fontSizeBottomLefttt33 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomLefttt3}px Arial`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthh33 = ctx.measureText(textBottomLefttt3).width; // Get the width of the text
        const textHeighhh33 = fontSizeBottomLefttt33; // Assuming single line of text
        ctx.fillText(textBottomLefttt33, squareX + textWidthh33 / 0.76, squareY + squareSizee.height / 1.05 - textHeighhh33 / 2); // Adjust the position as needed

        // Add text to the bottom right center of the square with dynamically adjusted font size
        const textBottomRight = "शयन कक्ष";
        const fontSizeBottomRight = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomRight}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr = ctx.measureText(textBottomRight).width; // Get the width of the text
        const textHeightr = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRight, squareX + squareSizee.width - textWidthr / 2, squareY + squareSizee.height / 2 - textHeightr / 2);

        // Add text to the bottom right of the square with dynamically adjusted font size
        const textBottomRight1 = "रसोई";
        const fontSizeBottomRight1 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomRight1}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr1 = ctx.measureText(textBottomRight1).width; // Get the width of the text
        const textHeightr1 = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRight1, squareX + squareSizee.width - textWidthr1 / 0.7, squareY + squareSizee.height / 10 - textHeightr1 / 2);


        const textBottomRight23 = "घी ";
        const fontSizeBottomRight23 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomRight23}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr23 = ctx.measureText(textBottomRight23).width; // Get the width of the text
        const textHeightr23 = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRight23, squareX + squareSizee.width - textWidthr23 / 1, squareY + squareSizee.height / 3.6 - textHeightr23 / 2);

        const textBottomRight223 = "भण्डार";
        const fontSizeBottomRight223 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black";
        ctx.font = `${fontSizeBottomRight223}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr223 = ctx.measureText(textBottomRight223).width; // Get the width of the text
        const textHeightr223 = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRight223, squareX + squareSizee.width - textWidthr223 / 2, squareY + squareSizee.height / 3.1 - textHeightr223 / 2);

        // Align text vertically in the middle
        const textBottomRightb1 = " हथियार गृह";
        const fontSizeBottomRight22b1 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black"
        ctx.font = `${fontSizeBottomRight22b1}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr22b1 = ctx.measureText(textBottomRightb1).width; // Get the width of the text
        const textHeightr22b1 = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRightb1, squareX + squareSizee.width - textWidthr22b1 / 3, squareY + squareSizee.height / 1.15 - textHeightr22b1 / 2);

        const textBottomRightbt1 = " सूतिका गृह";
        const fontSizeBottomRight22bt1 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black"
        ctx.font = `${fontSizeBottomRight22b1}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr22bt1 = ctx.measureText(textBottomRightb1).width; // Get the width of the text
        const textHeightr22bt1 = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRightbt1, squareX + squareSizee.width - textWidthr22bt1 / 2.7, squareY + squareSizee.height / 1.08 - textHeightr22bt1 / 2);

        const textBottomRightb12 = " शौच गृह ";
        const fontSizeBottomRight22b12 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black"
        ctx.font = `${fontSizeBottomRight22b12}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr22b12 = ctx.measureText(textBottomRightb12).width; // Get the width of the text
        const textHeightr22b12 = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRightb12, squareX + squareSizee.width - textWidthr22b12 / 1.8, squareY + squareSizee.height / 1.5 - textHeightr22b12 / 2);


        const textBottomRightb14 = "विद्या";
        const fontSizeBottomRight22b14 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black"
        ctx.font = `${fontSizeBottomRight22b14}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr22b14 = ctx.measureText(textBottomRightb14).width; // Get the width of the text
        const textHeightr22b14 = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRightb14, squareX + squareSizee.width / 1.3 - textWidthr22b14 / 2, squareY + squareSizee.height / 1.05 - textHeightr22b14 / 2);

        const textBottomRightb145 = "भ्यास";
        const fontSizeBottomRight22b145 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black"
        ctx.font = `${fontSizeBottomRight22b14}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr22b145 = ctx.measureText(textBottomRightb14).width; // Get the width of the text
        const textHeightr22b145 = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRightb145, squareX + squareSizee.width / 1.25 - textWidthr22b145 / 2, squareY + squareSizee.height / 1.01 - textHeightr22b145 / 2);

        // middle top

        const textBottomRightb1m = "शौच गृह ";
        const fontSizeBottomRight22b1m = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black"
        ctx.font = `${fontSizeBottomRight22b1m}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr22b1m = ctx.measureText(textBottomRightb1m).width; // Get the width of the text
        const textHeightr22b1m = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRightb1m, squareX + squareSizee.width / 1.5 - textWidthr22b1m / 2, squareY + squareSizee.height / 10 - textHeightr22b1m / 6);

        const textBottomRightb1m2 = "दहीं मन्थन";
        const fontSizeBottomRight22b1m2 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black"
        ctx.font = `${fontSizeBottomRight22b1m2}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr22b1m2 = ctx.measureText(textBottomRightb1m2).width; // Get the width of the text
        const textHeightr22b1m2 = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRightb1m2, squareX + squareSizee.width / 1.19 - textWidthr22b1m2 / 2, squareY + squareSizee.height / 10 - textHeightr22b1m2 / 6);

        const textBottomRightb1m23 = "गृह";
        const fontSizeBottomRight22b1m23 = Math.min(squareSizee.width, squareSizee.height) / 30; // Adjust the divisor as needed
        ctx.fillStyle = "black"
        ctx.font = `${fontSizeBottomRight22b1m23}px Arial`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle"; // Align text vertically in the middle
        const textWidthr22b1m23 = ctx.measureText(textBottomRightb1m23).width; // Get the width of the text
        const textHeightr22b1m23 = fontSizeBottomRight; // Assuming single line of text
        ctx.fillText(textBottomRightb1m23, squareX + squareSizee.width / 1.35 - textWidthr22b1m23 / 2, squareY + squareSizee.height / 7 - textHeightr22b1m23 / 6);


      }

    }

  }, [squareSizee, showSquaree, squareSize, showSquare, circles, areCirclesVisible, imageSrc, isImageVisible, show360Numbers, squareWidth, squareHeight, canvasVisible, dragOffset]);


  const handleIncreaseWidt = () => {
    setSquareSizee((prevSize) => ({ ...prevSize, width: prevSize.width + 10 }));
  };

  const handleDecreaseWidt = () => {
    if (squareSizee.width > 10) {
      setSquareSizee((prevSize) => ({ ...prevSize, width: prevSize.width - 10 }));
    }
  };

  const handleIncreaseHeigh = () => {
    setSquareSizee((prevSize) => ({ ...prevSize, height: prevSize.height + 10 }));

  };

  const handleDecreaseHeigh = () => {
    if (squareSizee.height > 10) {
      setSquareSizee((prevSize) => ({ ...prevSize, height: prevSize.height - 10 }));
    }
  };

  const handleToggleSquar = () => {
    setShowSquaree(!showSquaree); // Toggle the state to show/hide square
  };

  const handleIncreaseWidth = () => {
    setSquareSize((prevSize) => ({ ...prevSize, width: prevSize.width + 10 }));
  };

  const handleDecreaseWidth = () => {
    if (squareSize.width > 10) {
      setSquareSize((prevSize) => ({ ...prevSize, width: prevSize.width - 10 }));
    }
  };

  const handleIncreaseHeight = () => {
    setSquareSize((prevSize) => ({ ...prevSize, height: prevSize.height + 10 }));

  };

  const handleDecreaseHeight = () => {
    if (squareSize.height > 10) {
      setSquareSize((prevSize) => ({ ...prevSize, height: prevSize.height - 10 }));
    }
  };

  const handleToggleSquare = () => {
    setShowSquare(!showSquare); // Toggle the state to show/hide square
  };
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setDragOffset({ x: offsetX - (canvas.width / 2 - squareWidth / 2), y: offsetY - (canvas.height / 2 - squareHeight / 2) });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      setDragOffset({ x: offsetX - (canvas.width / 2 - squareWidth / 2), y: offsetY - (canvas.height / 2 - squareHeight / 2) });
    }
  };


  const increaseWidth = () => {
    setSquareWidth(prevWidth => prevWidth + 50);
  };

  const decreaseWidth = () => {
    setSquareWidth(prevWidth => Math.max(prevWidth - 50, 50)); // Ensure minimum width of 50
  };

  const increaseHeight = () => {
    setSquareHeight(prevHeight => prevHeight + 50);
  };

  const decreaseHeight = () => {
    setSquareHeight(prevHeight => Math.max(prevHeight - 50, 50)); // Ensure minimum height of 50
  };

  const handleToggleCircle360Numbers = (index) => {
    const newCircles = [...circles];
    newCircles[index].show360Numbers = !newCircles[index].show360Numbers;
    setCircles(newCircles);
  };
  const handleToggleImage = () => {
    setIsImageVisible(!isImageVisible);
  };

  const handleDownloadCanvas = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'canvas_image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const toggleCanvasVisibility = () => {
    setCanvasVisible(prevVisible => !prevVisible);
  };
  const handleToggleCircles = () => {
    setAreCirclesVisible(!areCirclesVisible);
  };

  const handleToggleCircle = (index) => {
    const newCircles = [...circles];
    newCircles[index].showCircle = !newCircles[index].showCircle;
    setCircles(newCircles);
  };



  const handleRotate = (index) => {
    const newCircles = [...circles];
    newCircles[index].rotationAngle = (newCircles[index].rotationAngle + Math.PI / 8) % (2 * Math.PI);
    setCircles(newCircles);
  };

  const handleLineCountChange = (e, index) => {
    const newCircles = [...circles];
    newCircles[index].lineCount = Number(e.target.value);
    setCircles(newCircles);
  };

  const handleDirectionCountChange = (e, index) => {
    const newCircles = [...circles];
    newCircles[index].directionCount = Number(e.target.value);
    setCircles(newCircles);
  };

  const handleIncreaseRadius = (index) => {
    const newCircles = [...circles];
    newCircles[index].radius += 10;
    setCircles(newCircles);
  };

  const handleDecreaseRadius = (index) => {
    const newCircles = [...circles];
    newCircles[index].radius -= 10;
    setCircles(newCircles);
  };

  const handleImageUpload = (e) => {
    const fileInput = e.target;
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  };

  const getDirectionLabel = (index, total) => {
    if (total === 8) {
      const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      return directions[index];
    } else if (total === 16) {
      const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      return directions[index];
    } else {
      return '';
    }
  };



  return (
    <div className='vas'>
      <div className='Header'>
        <label className='title'>Vastu</label>
      </div>
      <div className='main'>

        <div className='imag'>
          <label htmlFor="imageUpload" className='img1'>Select Image: </label>
          <input type="file" id="imageUpload" onChange={handleImageUpload} />
          <button onClick={handleToggleImage}>
            {isImageVisible ? 'Hide Image' : 'Show Image'}
          </button>
        </div>

        <div className='circle'>
          <label>Select All Circle</label><br></br>
          <button onClick={handleToggleCircles}>
            {areCirclesVisible ? 'Hide All Circles' : 'Show All Circles'}
          </button>
        </div>
        <div className='class1'>
          <div className='class01' >
            <button className='class02' onClick={handleToggleSquare}>
              {showSquare ? 'Hide Square' : 'Show Square'}
            </button>
            <button className='class03' onClick={handleIncreaseWidth}>Increase Width</button>
            <button className='class02' onClick={handleDecreaseWidth}>Decrease Width</button>
            <button onClick={handleIncreaseHeight}>Increase Height</button>
            <button onClick={handleDecreaseHeight}>Decrease Height</button>
          </div>
          <hr></hr>
          <div className='class01'>
          <button className='class02' onClick={toggleCanvasVisibility}>
            {canvasVisible ? 'Hide Canvas' : 'Show Canvas'}
          </button>
          <button  className='class03' onClick={increaseWidth}>Increase</button>
          <button  className='class02' onClick={decreaseWidth}>Decrease</button>
          <button className='class02' onClick={increaseHeight}>Increase</button>
          <button onClick={decreaseHeight}>Decrease</button>
          </div>
          <hr></hr>
          <div className='class01'>
            <button className='class02' onClick={handleToggleSquar}>
              {showSquaree ? 'Hide Square' : 'Show Square'}
            </button>
            <button className='class03' onClick={handleIncreaseWidt}>Increase Width</button>
            <button className='class02' onClick={handleDecreaseWidt}>Decrease Width</button>
            <button className='class02' onClick={handleIncreaseHeigh}>Increase Height</button>
            <button onClick={handleDecreaseHeigh}>Decrease Height</button>
          </div>
        </div>
        {circles.map((circle, index) => (
          <div className='map' key={index}>
            <label>
              Circle  Line Count {circle.id}:
              <select className='map1' value={circle.lineCount} onChange={(e) => handleLineCountChange(e, index)}>
                <option value={0}>None</option>
                <option value={8}>8</option>
                <option value={16}>16</option>
                <option value={32}>32</option>
              </select>
            </label>
            <br />
            <label>
              Number of Directions:
              <select className='map1' value={circle.directionCount} onChange={(e) => handleDirectionCountChange(e, index)}>
                <option value={0}>None</option>
                <option value={8}>8</option>
                <option value={16}>16</option>
              </select>
            </label>
            <br />
            <label>
              Show Circle:
              <input type="checkbox" checked={circle.showCircle} onChange={() => handleToggleCircle(index)} />
            </label>
            <br />
            <label>
              Show 360 Numbers:
              <input
                type="checkbox"
                checked={circle.show360Numbers}
                onChange={() => handleToggleCircle360Numbers(index)}
              />
            </label>
            <br />
            <button onClick={() => handleRotate(index)}>
              Rotate
            </button>
            <button className='map2' onClick={() => handleIncreaseRadius(index)}>
              Increase Radius
            </button>
            <button className='map3' onClick={() => handleDecreaseRadius(index)}>
              Decrease Radius
            </button>
          </div>
        ))}


        <div>

        </div>
        <div>
          <button className='down' onClick={handleDownloadCanvas}>
            Download
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={1000}
          height={1000}
          className='vastuu'
          style={{ border: '1px solid black' }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        ></canvas>
      </div>
    </div>
  );
};

export default Sip;
