# MRCT Helper Extension Documentation

## Overview

The MRCT Helper is a browser extension designed to assist with filling forms on the MRCT Registry website (www.mrct-registry.org). It provides predefined sets of form values (exam types) for CT and MRI exams, allowing users to quickly fill in forms with standard values.

The extension now supports:
- Built-in exam types for common scenarios
- Creating and saving custom exam types from current form values
- Managing (viewing and deleting) saved exam types
- Dynamically generating buttons for all exam types (built-in and custom)

## Installation

1. Download the extension files
2. In Firefox, go to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the extension directory

## How to Use

### Basic Usage

1. Navigate to a form page on the MRCT Registry website
2. The extension will automatically detect if it's a CT or MRI form
3. For CT forms, it will automatically fill the form with predefined CT values
4. For MRI forms, it will display buttons for different MRI exam types
5. Click on a button to fill the form with the corresponding exam type values

### Creating Custom Exam Types

1. Fill out a form on the MRCT Registry website with the values you want to save
2. Open the extension options page (right-click the extension icon and select "Options")
3. Click "Capture Current Form Values" to capture the current state of the form
4. Enter a name for the exam type in the "Exam Type Name" field
5. Click "Save Current Form Values as Exam Type" to save the exam type

### Managing Custom Exam Types

1. Open the extension options page
2. View all saved exam types in the "Saved Exam Types" section
3. To delete an exam type, click the "Delete" button next to its name

## Technical Details

### File Structure

- `manifest.json`: Extension configuration
- `mrct-helper.js`: Main content script that runs on the MRCT Registry website
- `options.html`: HTML for the options page
- `options.js`: JavaScript for the options page
- `popup/mrct-helper_popup.html`: HTML for the extension popup
- `popup/mrct-helper_popup.js`: JavaScript for the extension popup
- `popup/mrct-helper_popup.css`: CSS for the extension popup
- `tests.js`: Tests for the extension functionality

### Key Components

#### Exam Types

Exam types are objects containing key-value pairs, where:
- Keys are form field IDs or names
- Values are the values to be set for those fields

Example:
```javascript
{
  "suspcad": "",
  "patrisk": "medium",
  "stresstest": "ecg",
  // ... more fields
}
```

#### Storage

Custom exam types are stored in the browser's sync storage under the key `customExamTypes`. This allows the exam types to be synchronized across different instances of the browser if the user is signed in.

#### Form Filling

The extension uses the `fill_myform` function to fill forms with exam type values. This function:
1. Clears the form (while preserving patient data)
2. Loops through all fields in the exam type
3. Sets the value of each field according to its type (text, checkbox, radio, select)

#### Button Generation

For MRI forms, the extension dynamically generates buttons for all exam types (built-in and custom). This is done by the `createExamTypeButtons` function, which:
1. Starts with buttons for built-in exam types
2. Loads custom exam types from storage
3. Adds a button for each custom exam type
4. Returns the complete HTML for all buttons

## Testing

The extension includes a comprehensive test suite using Jest. To run the tests:

1. Install Jest:
   ```
   npm install --save-dev jest
   ```

2. Add the following to your `package.json`:
   ```json
   "scripts": {
     "test": "jest"
   }
   ```

3. Run the tests:
   ```
   npm test
   ```

The tests cover:
- Saving, loading, and deleting custom exam types
- Loading custom exam types from storage
- Creating buttons for exam types
- Filling forms with exam type values

## Troubleshooting

### Common Issues

1. **Form values not being captured**
   - Make sure you're on a form page on the MRCT Registry website
   - Check the browser console for any errors

2. **Custom exam type buttons not appearing**
   - Refresh the page after saving a new exam type
   - Check the browser console for any errors

3. **Form not being filled correctly**
   - Some fields may have changed on the website
   - Try capturing and saving the form values again

### Debugging

The extension logs information to the browser console. To view these logs:
1. Open the browser developer tools (F12 or right-click and select "Inspect")
2. Go to the "Console" tab
3. Look for messages from the extension

## Future Enhancements

Potential future enhancements for the extension include:
- Exporting and importing exam types
- Categorizing exam types
- More detailed form validation
- Support for more complex form structures