# RedJS - color your javascript





## Введение

RedJS довольно маленькая и быстрая библиотека, которую я написал под своё RIA. 

Первоначально не было уверенности, что хватит терпения писать проект на своей библиотеке, поэтому всё делалось похожее на **jQuery**, что бы в случае чего, без особых проблем перевести проект на него.  

### Использовал код

* с https://developer.mozilla.org
* из mootools. костяк для Array 1.6 back compatibility. Позаимствовал пару названий для методов String/Number.prototype. Возможно и какой-то код для них.

### Использовал материалы

* http://javascript.ru
* http://quirksmode.org
* и др

### Вдохновляли примеры

* CoreJS 
* CrossJS - отсюда взял фикс на Array.prototype.map
* microbe.js 





## Архитектура

Архитектура библиотеки это:

1. Кроссбраузерные функции работы с отдельными нодами. Вид: _.fn(node, .....).
2. Методы объекта/прототипа redjsCollection работы с выборками. Вид: _('selector').fn( ...... ).
3. Дополнительные модули функций, расширяющие redjs объект и/или прототип объекта коллекций.
4. Просто полезные функции.

1-е полностью дублируются 2-ми.  
Если функция геттер, то для коллекции возвращается значение на 1-м ноде.





## Подключение

В хедер добавляем:

`<script src="путь/к/red.js"></script>`

> **В сторону**

> Встроенного события DOMready в библиотеке нету.  
> Чтобы обеспечить подобный функционал подключаем перед закрытием body:

> `<script type="text/javascript">_.forсe(document, 'ready');</script>`

> Использование:

> `_(document).bind('ready', function() { ... });`





## Совместимость

Браузеры: **IE7+**

Библиотека создаёт 2-е глобальные переменные:

* 'redjs' (всегда).
* '_' - синоним 1-й. Создатся только если это имя не занято.

см функции: `_.easyModeOn()` и `_.easyModeOff()` в утилитах.





## Расширение встроенных объектов

### Array

* обратная совместимость с js 1.6(indexOf, lastIndexOf, forEach, map, filter, every, some).
* [].forEachInvert(function(current, index, array) { ... }) - перебираем массив с конца.
* [].copy() - возвращает копию массива.
* [].del(n) - удаление по индексу.
* [].linear(arr) - превращает любой массив в одномерный.
* [].pushOnce(smth) - добавляет значение, если такого нету в массиве.
* [].toggle(smth) - добавляет или удаляет значение в зависимости от его отсутствия или присутствия.

### String

* ''.isMail() [true/false] - является ли строка правильным почтовым ящиком.
* ''.hasWord(str) [true/false] - присутствует ли в строке слово.
* ''.camelCase() - возвращает строку в камелКэйсе.
* ''.toInt([base]) - преобразует в Int.
* ''.toFloat([base]) - преобразует в Float.
* ''.getColors() - возвращает массив [r, g, b]. Строка Hex или RGB не важно.
* ''.toRgb() -  '#fff'.toRgb() // возвращает 'rgb(255, 255, 255)'.
* ''.toHex() - 'rgb(255, 255, 255)'.toHex() // возвращает '#ffffff'.

### Number

* n.limit(a, b) - если число входит в интервал [min, max] вернёт его. Иначе ближнее значение.





## Утилиты

### _.type(smth)

Функция возвращает объект типа Type.

Исторически получилось несколько способов применения:

`_.type('Hi world!').is('string') // true`

`_.type({a: 1}) === _.type.object // true`

Рекомендуется 1-й, как оказалось - более быстрый.

Перечень типов:

* undefined 
* boolean 
* number 
* string 
* function 
* node 
* nodelist 
* array 
* object 
* null 
* redjs 
* unknown (на всякий случай:)) 

Так же объект можно привести к строковому значению:

	_([1,2,3])+'' // array

### Определение браузера

`if(_.browser.firefox) { ... }` допустимые св-ва: 

* firefox 
* msie 
* opera 
* chrome 
* safari 

`if(_.ielt9) { ... }`

### Остальные
* _.isEmptyObj(obj) - [true/false] если у объекта нет перечисляемых св-в.
* _.joinObj(a, b, c ...) - создаёт новый объект и в него переписывает св-ва объектов переданных в функцию.
* _.toArray(a, b, c ...) - возвращает массив из всего, что перечисляется. Простые типы просто push-аться.
* _.easyModeOn() [true/false] - пытается объявить односимвольный глобальный синоним.
* _.easyModeOff() [true/false] - пытается удалить односимвольный глобальный синоним.
* _.props(obj) - распечатывает св-ва объекта в консоль.
* _.time(function() { ... }) - считает время выполнения кода.





## Кроссбраузерные функции работы с нодами (1)

### Функции выборки

* _.tag('tagName') - сокращённая запись document.getElementsByTagName('tagName').
* _.id('id') - сокращённая запись document.getElementById('id').
* _.className('className') - сокращённая запись document.getElementsByClassName('className').

### Работа с DOM

* _.create('tagName', attr) - сокращённая запись document.createElement(tagName). 2-й аргумент объект. Его св-ва становятся атрибутами нового нода.
* _.wrap(node, 'wrap', [attr]) - Делает обёртку нода. Если 2-й параметр строка - параметры 2,3 передаются функции _.create.
* _.children(node, ['tagName']) - возвращает потомков нода. Если 2-й параметр задан - фильтрует их по имени нода.
* _.firstChild(node, [child]) - в зависимости от наличия 2-го параметра получает или устанавливает первый потомок нода.
* _.getNodeText(node) - полезная функция для работы с xml.

### Работа с className

* _.addClass(node, 'name') - добавляем класс.
* _.delClass(node, 'name') - удаляем класс.
* _.hasClass(node, 'name) [true/false] - проверяем наличие класса.
* _.toggleClass(node, 'name') [true/false] - пытается установить или удалить класс в зависимости от его отсутствия или присутствия.





## Подробнее об объекте redjsCollection

Функция redjs возвращает объект типа redjsCollection. Её аргумент может иметь следующий вид:

* _('tagName', parent)
* _('.className', parent)
* _('#id', parent)
* _('+tagName') - создаёт элемент.

1-й аргумент так же может быть *нод/ноллист/массив с нодами/redjsCollection*. В этом случае 2-й аргумент не берётся в расчёт.
*parent* - может быть *строка-селектор/нод/ноллист/массив с нодами/redjsCollection*

Структура коллекции:

	{
		length: n,
		ns: [node1, node2, ...]
	}

Для мультивыбора предусмотрена функция: **_.multi(a, b, c)**

Так же с коллекциями можно делать следующее:

	var c = _('*').exclude('span', _('div'));
	c.include('.span-with-some-class');

### Расширение прототипа коллекций

Расширение прототипа redjsCollection делается фунцией **_.extend({prop: smth, ... })**

Обратите внимание, что это **не универсальная** функция extend.





## Функции работы с выборкой (2), за исключением дубляжей (1)

### Перебор

* each(function(current, index, array) { ... })

### Фильтрация/Изменения/Добавления/и пр

* filter(function(current, index, array) { ... }) [true/false]
* eq(n)
* first()
* last()
* find('selector')
* include(param)
* exclude(param)
* parent() - возвращает выборку с родительскими нодами, тех, что в выборке.

**param** - всё что можно передовать в redjs() первым параметром.

### Атрибуты

* attr(name, [val])  - геттер и сеттер.
* val([val]) - геттер и сеттер. // берётся через св-во

### DOM

* html('str') - устанавливает innerHTML.
* append(param) - param - нод либо хтмл текст.


## Data модуль

Обеспечивает функции прикрепления данных к ноду, для устранения так называемых утечек в памяти.

`_.data(node, name, [val])`

`_(node).data(name, [val])`

> Честно говоря с jquery-евской data особо не разбирался, но тесты производительности показали ошеломляющий перевес в скорости моей функции(точно не помню цифру. более чем на порядок).





## Events модуль {зависимости: Data}

Работа с нодом:

	function foo(a, b) {alert(1);}
	_.event.add(node, 'eventName', foo);
	_.event.add(node, 'eventName', foo);
	_.event.del(node, 'eventName', foo);
	_.force(node, 'eventName'); // 1
	_.event.clear(node, 'eventName');
	_.force(node, 'eventName'); // ничего

**eventName** может быть любое, тк поддерживаются искусственные ивенты.

Укороченный вариант:

	_.bind(node, 'eventName', foo);
	_.unbind(node, 'eventName', foo);

Для выборок это:

	_( ... ).bind('eventName', foo);
	_( ... ).unbind('eventName', foo);

Так же для выбророк есть укороченные варианты методов **встроенных ивентов**:

* click
* dblclick
* mousedown
* mouseup
* mouseover
* mouseout
* focus
* blur
* change
* submit
* keypress
* mouseenter(кроссбраузерное)
* mouseleave(кроссбраузерное)

### _.event.create('anyEventName', 'buildedInEvent', func)

С помощью этой функции можно заассайнить выполнение искусственных ивентов, повесив их на встроенные. func - функция, которая проверяет какое-то условие, должна возвращать истина/ложь.




## CSS модуль

Основноая функция, которую я пытался сделать более менее универсальной: **_.css(node, name, [value])**

Работает как геттер или сеттер в зависимости от кол-ва параметров.

Имена св-в как и в нативном js.

Пока пофикшены следующие св-ва:

* opacity 
* float 

Для получения рассчитанного св-ва есть синоним: `_.gstyle(node, name)`

Этот модуль так же предоставляет функцию **_.height(node, padding, border, margin)**

padding, border, margin - true если надо учиывать.




## Deferred модуль

Предоставляет 2 типа объекта.

### FuncList

	function foo(a, b) {alert([this, a, b].join());}
	var f = _.funcList();
	f.add(foo);
	f.add(foo);
	f.add(foo);
	f.exec(1, 2, 3); // '1,2,3' 3 раза
	f.del(foo);
	f.exec(1, 2, 3); // '1,2,3' 2 раза
	f.del(foo, true);
	f.exec(1, 2, 3); // ничего

У объекта так же есть св-во **calls** хранящее в себе число вызовов.

### Deferred

	var d = _.deferred();
	d.succes(function(arg1, arg2) {
		alert('success');
	}).error(function(arg1, arg2) {
		alert('error');
	}).anyway(function(arg1, arg2) {
		alert('anyway');
	});

	d.resolve(context, arg1, arg2); // alert success, anyway
	d.reject(context, arg1, arg2); // ничего

У объекта так же есть св-во **status**. Значения

* -1 - не вызывался
* 0 вызвался через reject
* 1 вызвался через resolve

> А так же св-ва типа funcList: errorList, successList, errorList ^^





## Ajax модуль {зависимости: Deferred}

Основная функция: **_.aj.query([attr])**. Возвращает deferred объект.

Св-ва, что не указаны в объекте attr, берутся у объекта **_.aj.settings**. Сейчас там мои настройки - меняйте на свои.

Настройки по умалчанию:

	{
		'type': 'post',
		'url': location.href,
		'user': null,
		'password': null,
		'accept': 'json'
	}

Пример:

	var smt = window; // eg
	var req = _.aj.query({
		before: function() {alert(1);},
		timeout: 30000,
		context: smth
	});
	req.success(function() {
		alert(2);
	}).error(function() {
		alert(3);
	}).anyway(function() {
		alert(4);
	});
	req.reject(); // запрос прервётся. выведет: 1, 3, 4

Для работы с json, следует подключить скрипт с http://json.org отдельно(для совместимости)

	...success(function(data) {
		data = JSON.parse(data);
	})...




## Cookies модуль

Предоставляет универсальную функцию работы с куками:

	_.cookie(name, value, [days], [otherAttr]); // set
	var val = _.cookie(name); // get

**otherAttr** - объект с именами св-в такими же как у опций печенек.





## Animation модуль {зависимости: Data, CSS}

Костяк модуля следующая функция:

	_.animate(node, type, terminal, time, [callback], [fnName]);


* type - css св-во
* terminal - значение по окончании анимации (без ед измерения. она вычисляется сама)
* time - время анимации
* callback - функция запустится по оканчании анимации.
* fnName - значения: linear, swing. По умалчанию 2-я.

### Комплексные функции:

* _.hide(node, [time]) - с временем => непрозрачность = 0 + display = node. Без времени => правильный хайд.
* _show(node, [time]) - с временем => непрозрачность = 1 + display = какое было || block. Без времени => правильный шоу.





