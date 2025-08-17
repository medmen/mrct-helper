# MRCT Helper Extension Documentation

## Overview

MRCT Helper is a browser extension designed to assist with filling forms on the MRCT Registry website (www.mrct-registry.org). It provides predefined sets of form values (exam types) for CT and MRI exams, allowing users to quickly fill in forms with standard values.

The extension now supports:
- Built-in exam types for common scenarios

Future enhancements include:
- Creating and saving custom exam types from current form values
- Managing (viewing and deleting) saved exam types
- Dynamically generating buttons for all exam types (built-in and custom)

## Installation "Normal User"
1. Go to the [MRCT Helper Extension page on Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/mrct-helper/)
2. Click "Add to Firefox"
3. Follow the prompts to install the extension
4. The extension will automatically start working ONLY on the MRCT Registry website

## Installation (Developer for Testing and Improvement)

1. Download the extension files
2. In Firefox, go to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the extension directory

## How to Use

### Basic Usage

1. Navigate to a form page on the MRCT Registry website
2. The extension will automatically detect if it's a CT or MRI form
3. For CT forms, it will automatically fill the form with predefined CT values (right now there is only one preset for CT exams)
4. For MRI forms, it will display buttons for different MRI exam types
5. Click on a button to fill the form with the corresponding exam type values

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
- keys and values must match the form fields on the MRCT Registry website (which luckily did not change since years AFAIK)

Example:
```javascript
{
  "suspcad": "",
  "patrisk": "medium",
  "stresstest": "ecg",
  // ... more fields
}
```
#### Form Filling

The extension uses the `fill_myform` function to fill forms with exam type values. This function:
1. Clears the form (while preserving patient data which was added in a popup window before)
2. Loops through all fields in the exam type
3. Sets the value of each field according to its type (text, checkbox, radio, select)
4. Highlights the most important fields to enter by hand in red 


### Debugging

The extension logs information to the browser console. To view these logs:
1. Open the browser developer tools (F12 or right-click and select "Inspect")
2. Go to the "Console" tab
3. Look for messages from the extension

## Future Enhancements

Potential future enhancements for the extension include:
- Creating and saving custom exam types from current form values
- Exporting and importing exam types (JSON format)
- More detailed form validation