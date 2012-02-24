
http://redjs.org/documentation/redjsbuilder

##Requirements

.NET Framework 3.5

##Notice

This product includes Microsoft Ajax Minifier library - http://ajaxmin.codeplex.com/

###Syntax

**Header**

Each file in a project should has a header:

For example (RedJS start file):

	//~ <component>
	//~	Name: [...]
	//~	Info: [...]
	//~ </component>

Nubmer of space characters is variable. Mixing of fields order is inadmissible.
Name value of module should be unique inside the project.

**Get statments**

There are two ‘get-module’ statments:

	//~ require: relative/path/to/the/module
	//~ include: relative/path/to/the/module

Relative path considers file location.

If file doesn’t exist require statement cause building error (project won’t build).
Include statement behaves as require, if module checked (RedJSBuilder Content tab).

If relative path is path to the directory, it interprets as include statement for all files in directory.

*Other options*

	//~ <draft>
		alert('Omg');
	//~ </draf>

This snippet will be included or excluded from code correspondingly checkbox “Include drafts” status (Options tab).





