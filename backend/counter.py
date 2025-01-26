import cv2
import numpy as np

def count_pills_in_livefeed():
    # Open webcam feed (use 1 for an external webcam, 0 for default webcam)
    cap = cv2.VideoCapture(1)  # Change to 0 if you are using the default webcam

    if not cap.isOpened():
        print("Error: Could not access the webcam.")
        return

    while True:
        # Capture frame-by-frame
        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to capture image.")
            break

        # Convert to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Apply GaussianBlur to reduce noise
        blurred = cv2.GaussianBlur(gray, (15, 15), 0)

        # Use adaptive thresholding to handle varying lighting and colors
        thresholded = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                           cv2.THRESH_BINARY_INV, 11, 2)

        # Find contours
        contours, _ = cv2.findContours(thresholded, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # Initialize pill count
        pill_count = 0

        for cnt in contours:
            # Calculate the area of each contour
            area = cv2.contourArea(cnt)

            # Only consider contours that are large enough to be pills
            if area > 500:  # Adjust this threshold based on the size of pills in the frame
                pill_count += 1

                # Draw the contour (for visualization purposes)
                cv2.drawContours(frame, [cnt], -1, (0, 255, 0), 3)

        # Display the pill count on the frame
        cv2.putText(frame, f"Pills Count: {pill_count}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # Show the frame with the detected pills
        cv2.imshow("Pill Detection Live Feed", frame)

        # Break the loop when 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the webcam and close the window
    cap.release()
    cv2.destroyAllWindows()

# Start the live feed
count_pills_in_livefeed()
