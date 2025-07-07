// MRCT Helper Extension Tests
// This file contains tests for the MRCT Helper extension functionality

// Mock browser API for testing
const mockBrowser = {
  storage: {
    sync: {
      get: jest.fn(),
      set: jest.fn()
    }
  },
  tabs: {
    query: jest.fn(),
    executeScript: jest.fn()
  }
};

// Mock document for testing
const mockDocument = {
  getElementById: jest.fn(),
  getElementsByTagName: jest.fn(),
  getElementsByName: jest.fn(),
  createElement: jest.fn(),
  querySelector: jest.fn()
};

// Test suite for options.js functionality
describe('Options Page Functionality', () => {
  // Setup before each test
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup global browser object
    global.browser = mockBrowser;
    global.document = mockDocument;
    
    // Import the functions to test
    global.saveExamType = saveExamType;
    global.loadSavedExamTypes = loadSavedExamTypes;
    global.deleteExamType = deleteExamType;
    global.captureCurrentFormValues = captureCurrentFormValues;
  });
  
  // Test saving an exam type
  test('saveExamType should save a new exam type to storage', async () => {
    // Mock DOM elements
    document.getElementById.mockReturnValueOnce({ value: 'Test Exam Type' });
    
    // Mock storage
    mockBrowser.storage.sync.get.mockResolvedValueOnce({ customExamTypes: {} });
    mockBrowser.storage.sync.set.mockResolvedValueOnce();
    
    // Set current captured form values
    global.currentCapturedFormValues = { field1: 'value1', field2: 'value2' };
    
    // Call the function
    await saveExamType();
    
    // Check if storage.sync.set was called with the correct parameters
    expect(mockBrowser.storage.sync.set).toHaveBeenCalledWith({
      customExamTypes: {
        'Test Exam Type': { field1: 'value1', field2: 'value2' }
      }
    });
  });
  
  // Test loading saved exam types
  test('loadSavedExamTypes should load and display saved exam types', async () => {
    // Mock DOM elements
    const mockContainer = {
      innerHTML: ''
    };
    document.getElementById.mockReturnValueOnce(mockContainer);
    
    // Mock storage with saved exam types
    mockBrowser.storage.sync.get.mockResolvedValueOnce({
      customExamTypes: {
        'Type1': { field1: 'value1' },
        'Type2': { field2: 'value2' }
      }
    });
    
    // Call the function
    await loadSavedExamTypes();
    
    // Check if the container's innerHTML was updated
    expect(mockContainer.innerHTML).not.toBe('<p>No saved exam types yet.</p>');
  });
  
  // Test deleting an exam type
  test('deleteExamType should remove an exam type from storage', async () => {
    // Mock confirm to return true
    global.confirm = jest.fn().mockReturnValueOnce(true);
    
    // Mock storage with saved exam types
    mockBrowser.storage.sync.get.mockResolvedValueOnce({
      customExamTypes: {
        'Type1': { field1: 'value1' },
        'Type2': { field2: 'value2' }
      }
    });
    mockBrowser.storage.sync.set.mockResolvedValueOnce();
    
    // Call the function
    await deleteExamType('Type1');
    
    // Check if storage.sync.set was called with the correct parameters
    expect(mockBrowser.storage.sync.set).toHaveBeenCalledWith({
      customExamTypes: {
        'Type2': { field2: 'value2' }
      }
    });
  });
});

// Test suite for mrct-helper.js functionality
describe('MRCT Helper Functionality', () => {
  // Setup before each test
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup global browser object
    global.browser = mockBrowser;
    global.document = mockDocument;
    
    // Import the functions to test
    global.loadCustomExamTypes = loadCustomExamTypes;
    global.fill_myform = fill_myform;
    global.clearForm = clearForm;
    global.enter_field = enter_field;
    global.createExamTypeButtons = createExamTypeButtons;
  });
  
  // Test loading custom exam types
  test('loadCustomExamTypes should load custom exam types from storage', async () => {
    // Mock storage with saved exam types
    mockBrowser.storage.sync.get.mockResolvedValueOnce({
      customExamTypes: {
        'Type1': { field1: 'value1' },
        'Type2': { field2: 'value2' }
      }
    });
    
    // Mock examtypes object
    global.examtypes = {};
    
    // Call the function
    const result = await loadCustomExamTypes();
    
    // Check if the result contains the custom exam types
    expect(result).toEqual({
      'Type1': { field1: 'value1' },
      'Type2': { field2: 'value2' }
    });
    
    // Check if the custom exam types were added to the examtypes object
    expect(global.examtypes.Type1).toEqual({ field1: 'value1' });
    expect(global.examtypes.Type2).toEqual({ field2: 'value2' });
  });
  
  // Test creating exam type buttons
  test('createExamTypeButtons should create buttons for all exam types', async () => {
    // Mock loadCustomExamTypes to return custom exam types
    global.loadCustomExamTypes = jest.fn().mockResolvedValueOnce({
      'Custom Type 1': { field1: 'value1' },
      'Custom Type 2': { field2: 'value2' }
    });
    
    // Call the function
    const result = await createExamTypeButtons();
    
    // Check if the result contains buttons for built-in and custom exam types
    expect(result).toContain('MRT_ITIS_15T');
    expect(result).toContain('MRT_ITIS_3T');
    expect(result).toContain('MRT_STRESS');
    expect(result).toContain('Custom Type 1');
    expect(result).toContain('Custom Type 2');
  });
  
  // Test filling a form with exam type values
  test('fill_myform should fill a form with exam type values', async () => {
    // Mock examtypes object
    global.examtypes = {
      'Test Type': {
        field1: 'value1',
        field2: 'value2'
      }
    };
    
    // Mock clearForm function
    global.clearForm = jest.fn();
    
    // Mock enter_field function
    global.enter_field = jest.fn();
    
    // Mock document.getElementById to return a field object
    document.getElementById.mockReturnValue({ type: 'text' });
    
    // Call the function
    const result = await fill_myform('Test Type');
    
    // Check if clearForm was called
    expect(global.clearForm).toHaveBeenCalled();
    
    // Check if enter_field was called for each field
    expect(global.enter_field).toHaveBeenCalledTimes(2);
    
    // Check if the function resolved with SUCCESS
    expect(result).toBe('SUCCESS');
  });
});

// How to run these tests:
// 1. Install Jest: npm install --save-dev jest
// 2. Add to package.json: "scripts": { "test": "jest" }
// 3. Run: npm test