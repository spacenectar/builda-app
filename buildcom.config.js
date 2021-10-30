module.exports = {
    // The folder the components will be generated in. This is relative to the current working directory.
    "output": "./src/components",
    // Output components in TypeScript format (outputs as regular JavaScript files if false).
    "use_typescript": true,
    // Generate storybook stories for each component.
    "use_storybook": true,
    // Use MDX for storybook stories (uses CSF if false).
    "story_format_mdx": false,
    // Generate Jest tests for each component.
    "use_jest": true,
    // Filename format for test files (can be anything you like but *.test.* or *.spec.* is recommended).
    "test_file_name": '*.spec.*',
    // Specify the CSS preproccessor to use, e.g. 'sass', 'less', 'stylus', 'scss', or 'none'.
    "output_stylesheets": true,
    // Specify the CSS preproccessor to use, e.g. 'sass', 'less', 'stylus', 'scss', or 'none'.
    "css_preprocessor": 'sass',
    // use the CSS module format?
    "css_modules": false,
       // Generate a README.md file for each component.
    "generate_readme": true,
    // Output component types in their own subfolder (will output in the components index file if false).
    "create_types_subfolder": false,
    // If true, example code will be added to the component files. If false, the files will be bare-bones.
    "output_example_code": true
};