
##Implementation

Builder uses source point abstraction.
It can be file or directory and actually means another node in treeView.

###File syntax

Statements is solid (space number can vary).


*Header*

Desired part of project. It looks like (without square brackets):

	//~ <component>
	//~	Name: [...]
	//~	Info: [...]
	//~ </component>

It improves data performance in treeView. Header responsibilities may be extended in future.

*Points inclusion*

There are two get statements (without square brackets):

	//~ require: [relative path]
	//~ include: [relative path]

Relative path considers current file's directory.

If file doesn't exist require statement cause building error (project won't be build).
Include statement behave as require, if checked.

If relative path is path to the directory, it interprets as get statement for all files in directory.

*Other things*

	//~ <draft>
		alert('Omg');
	//~ </draf>

This snippet will be included or excluded from code correspondingly checkbox status in "Options" tab.

##Requirements

.NET Framework 3.5

##Notice

This product includes Microsoft Ajax Minifier library - http://ajaxmin.codeplex.com/


