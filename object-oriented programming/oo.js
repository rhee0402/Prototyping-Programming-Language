// Prototype Programming 
// Project5 (addtional codes from Project4)
// By Min Hyoung Rhee
// oo.js

var OO = {};

var isInBlock;
var numSend;
var counter;

OO.initializeCT = function() {
	OO.ctable = new EmptyCT();
	isInBlock = false;
	isInProgram = false;
	numSend_trans = 0;
	numSend = 0;
	counter = 0;
	// adding "Object" class and its methods to the ClassTable
 	OO.ctable = new CT("Object", "123NoSuperClass", [], OO.ctable); //superclass of Object is none
	OO.ctable.addMethod("Object","initialize", function(_this){});
  	OO.ctable.addMethod("Object", "===", function(_this,x){ return _this === x; });
	OO.ctable.addMethod("Object", "!==", function(_this,x){ return _this !== x; });
	OO.ctable.addMethod("Object", "isNumber", function(_this){ return false;});
	
	//adding "Number" class and its methods to the ClassTable
	OO.ctable = new CT("Number", "Object", [], OO.ctable);
	OO.ctable.addMethod("Number", "isNumber", function(_this){return true;});
	OO.ctable.addMethod("Number", "+", function(_this,y){return _this+y;});
	OO.ctable.addMethod("Number", "-", function(_this,y){return _this-y;});
	OO.ctable.addMethod("Number", "*", function(_this,y){return _this*y;});
	OO.ctable.addMethod("Number", "/", function(_this,y){return _this/y});
	OO.ctable.addMethod("Number", "%", function(_this,y){return _this%y});
	OO.ctable.addMethod("Number", "<", function(_this,y){return _this < y;});
	OO.ctable.addMethod("Number", "<=", function(_this,y){return _this <= y;});
	OO.ctable.addMethod("Number", ">=", function(_this,y){return _this >= y});
	OO.ctable.addMethod("Number", ">", function(_this,y){return _this >y});
	
	//adding "Null", "Boolean", "True", "False" class into the ClassTable
	OO.ctable = new CT("Null", "Object", [], OO.ctable);
	OO.ctable = new CT("Boolean", "Object", [], OO.ctable);
	OO.ctable = new CT("True", "Boolean", [], OO.ctable);
	OO.ctable = new CT("False", "Boolean", [], OO.ctable);
	
	//adding "Block" class and its method into the ClassTable
	OO.ctable = new CT("Block", "Object", ["block_args", "block_stmts"], OO.ctable);

	//Block class' initialize method
	OO.ctable.addMethod("Block","initialize", 
	function(_this, tblock_args, tblock_stmts_string){
    try{
		  _this.block_args = tblock_args;
		  _this.block_stmts_string = tblock_stmts_string;
     }catch(err){throw new Error("message at init is: "+err);}
		});
		
	// Block class' call method
	// evaluate expression inside the Block class.
	OO.ctable.addMethod("Block", "call", function(_this){
		  var rest_args = Array.prototype.slice.call(arguments);
		  rest_args.splice(0,1); 
		  //evaluate and map each argument
		  for(var i=0; i<rest_args.length; i++){
			  var arg = rest_args[i];
			  var target = _this.block_args[i];
			  eval(target +" = arg");
		  }
		  //run each statement
		  var ret_value = null;
		  for(var i=0; i<_this.block_stmts_string.length; i++){
			  var stmt = _this.block_stmts_string[i].replace(new RegExp("quote540", 'g'), "\"");
//			   if(counter == 0) //uncomment two lines for debugging purpose
//			    throw new Error("statement looks like: " + stmt);
				counter++;
		        var temp_value = eval(stmt);
				if(temp_value instanceof Array)
				  if(temp_value[0] === "returnState170"){
				    throw new returnException("return", temp_value[1]);
				  }
			  if(typeof(temp_value) != "undefined"){
			    ret_value = temp_value;
			  }
		  }
		  return ret_value;
		});
				
};

// declareClass(name, superClassName, instVarNames)
// add new class entry into the ClassTable.
OO.declareClass = function (name, superClassName, instVarNames){
	// check duplicate class (name) declaration
	if(OO.ctable.contain(name))
	  throw new Error("duplicate class declaration on class: " + name);
	// check undeclared superclass name
	if(!(OO.ctable.contain(superClassName)))
	  throw new Error("undeclared superClass: " + superClassName);
	// check duplicates instance variable declaration (including from superlcass)
	var superClassInstVarNames = OO.ctable.getAllInstVarNames(superClassName);
	for(var i=0; i< instVarNames.length; i++){
		for(var j=0; j<instVarNames.length; j++){
		  if(i !== j){
			if(instVarNames[i] === instVarNames[j])
			  throw new Error("duplicate instance varaible declaration in same declaration: "+instVarNames[i]);
		  }
		}
		for(var k=0; k<superClassInstVarNames.length; k++){
		  if(instVarNames[i] === superClassInstVarNames[k])
		  	throw new Error("duplicate instance varaible declaration with superclass: " + instVarNames[i]);	
		}	
	}
	OO.ctable = new CT(name, superClassName, instVarNames, OO.ctable);
};

// declareMethod(className, selector, implFn)
// add new method information to the corresponding class entry in the ClassTable
OO.declareMethod = function(className, selector, implFn){
	try{
	OO.ctable.addMethod(className,selector,implFn);
	}catch(err){throw new Error("error occured in declareMethod: " + err.message);}
return false;
};

// instantiate(className /* , arg1,arg2...*/)
// instantiate new instance of classs
OO.instantiate = function(className /* , arg1,arg2...*/) {
	var new_classInstance = new ClassInst("123EmptyClass", className);
	var args = Array.prototype.slice.call(arguments);
	args.splice(0,1);
	try{
	  OO.ctable.callMethod(new_classInstance, className, "initialize", args);
	}catch(err){throw new Error("error at instantiate: " + err);}
	return new_classInstance;
}

// send(recv,selector /*arg1, arg2...*/)
// call method recv.selector(arg1, arg2....) not including method in the superclass
OO.send = function(recv,selector /*arg1, arg2...*/){
	var args = Array.prototype.slice.call(arguments);
	args.splice(0,2);
	numSend = numSend + 1;
	var retValue;
	try{
		if(typeof recv === "number"){ // for number "object"			
			retValue = OO.ctable.callMethod(recv, "Number", selector, args);		
		}
		else if(recv === null){
			retValue =  OO.ctable.callMethod(recv, "Null", selector, args);
		}
		else if(recv === true){
			retValue = OO.ctable.callMethod(recv, "True", selector, args);
		}
		else if(recv === false){
			retValue = OO.ctable.callMethod(recv, "False", selector, args);
		}
		else{
			  retValue =  OO.ctable.callMethod(recv, recv.className,selector, args);
		}
		numSend = numSend -1;
		return retValue;
		}catch(err){
				if(err.exceptionType=== "return"){
				   if(numSend === 1){ //return until the last send for non-local return
				       numSend = numSend -1;
				       return err.retval;
				   }
				   else{
				      numSend = numSend -1;
				      throw new returnException("return", err.retval);
				   }
				} //end of if exceptionType === "return"
				else{
				   numSend = numSend -1;
				  throw err;
				}
		      }//end of catch
		
		
};

// superSend(superClassName, recv, selector /*arg1, arg2...*/)
// call method recv.selector(arg1, arg2....) where method is declared in the superclass
OO.superSend = function(superClassName, recv, selector /*arg1, arg2...*/){
	var args = Array.prototype.slice.call(arguments);
	args.splice(0,3);
	return OO.ctable.callMethod(recv, superClassName,selector, args);	
};

// getInstVar(recv, instVarName)
// return value of instance variable: recv.instVarName
OO.getInstVar = function(recv, instVarName){
	return recv.getValue(instVarName);
};

// setInstVar(recv, instVarName, value)
// set value of instance variable named instVarName equal to value in recv: recv.instVarName = value
OO.setInstVar = function (recv, instVarName, value){
	recv.setValue(instVarName, value);
};

// getSuperClassName(recv)
// return string value of name for the superclass of recv
OO.getSuperClassName = function(recv){
 try{
	if(typeof recv === "number")
	  return "Object";
	else if(typeof recv === "True")
	  return "Boolean";
	else if(recv == true)
	  return "Boolean";
	else if(typeof recv === "False")
	  return "Boolean";
	else if(recv == false)
	  return "Boolean";
	else if(typeof recv === "Boolean")
	  return "Object";
	else if(typeof recv === "Null")
	  return "Object";
	else if(recv == null)
	  return "Object";
	else
	  return OO.ctable.getClass(OO.getInstVar(recv, "className")).superClassName;
 }catch(err){throw new Error("Error at getSuperClassName: "+recv);}
};

//****************************************************************************//
// storing class instances and related functions
function ClassInst(name, className){
	this.name = name; // problem occur if user try to use instance variable name, or className
	this.className = className; // so I should change to something longer so problem is minor
};

// ClassInst.prototype.getValue(varName)
// return the class instance given name of class instance (i.e. identifier)
ClassInst.prototype.getValue = function(varName){
	if(true || OO.ctable.containVarNames(this.className,varName)){
		if(typeof eval("this."+varName) === 'undefiend')
		  throw new Error("variable: "+varName+" is not initialized");
		return eval("this."+varName);
	}
	else
		throw new Error("in getValue: undeclared instance varaible: "+varName);
};

// ClassInst.prototype.setValue(varName, values)
// set value of receiver(i.e. ClassInst) to value given by the user
ClassInst.prototype.setValue = function(varName, values){
	if(OO.ctable.containVarNames(this.className, varName)){
		try{
			var temp = values;
			eval("this."+varName + " = temp");
		}catch(err){throw new Error("error occured in setValue: " + err.message);}
	}
	else
		throw new Error("in setValue: undeclared instance varaible: "+varName);
};



//****************************************************************************//
// Linked-List of storing method information and related functions

// EmptyMethodList class
// represent end of linked list that contain method information
function EmptyMethodList(){};

// MethodList class
// name: string name of method
// implFn: arguments & body of this method as an function
// oldMethodList: next methodList element.
function MethodList(name, implFn, oldMethodList){
	this.name = name;
	this.implFn = implFn;
	this.prev = oldMethodList;
};

EmptyMethodList.prototype.contain = function(name){ return false;};

EmptyMethodList.prototype.callMethod = function(_this,name,args){
	throw new Error("trying to calling unexisting method: "+name);
};

//MethodList.prototype.contain(name)
// return true if method with given name exist in the linked list
//        false if it did not found method with matching name and reached EmptyMethodList
MethodList.prototype.contain = function(name){
	if(this.name === name)
	  return true;
	else
	  return this.prev.contain(name);
};


// MethodList.prototype.callMethod(_this, methodName, args)
// methodName: string name of method to be called
// args: arguments to the method in array
// call method's body if method exist
// else throw an exception if it reached EmptyMethodList
MethodList.prototype.callMethod = function(_this, methodName, args){
	if(this.name === methodName){
		var new_args = [_this].concat(args);
		  return this.implFn.apply(_this, new_args);
	}
	else
		return this.prev.callMethod(_this,methodName,args);
}



//********************************************************************************//
// Linked List of storing class information and related function

function EmptyCT(){};

function CT(name, superClassName, instVarNames, oldCT){
	this.name = name;
	this.superClassName = superClassName;
	this.instVarNames = instVarNames;
	this.methods = new EmptyMethodList();
	this.prev = oldCT;
};

EmptyCT.prototype.contain = function(name){ return false; };

EmptyCT.prototype.getAllInstVarNames = 
	function(name){ 
		throw new Error("cannot find class: " +name+ " in the process of running getAllInstVarNames function");
	};
	
EmptyCT.prototype.addMethod =
	function(name){ 
		throw new Error("cannot find class: " + name + " in the process of running addMethod function");
	};
	
EmptyCT.prototype.getClass = function(className){
	throw new Error("trying to obtain not existing class: " + className);
}

EmptyCT.prototype.callMethod = function(_this, className, methodName, args){
	throw new Error("MethodCall request on EmptyClassTable: "+className+"."+methodName);
};

EmptyCT.prototype.containVarNames = function(className,varName){
	throw new Error("trying to check exsitence of variable: "+varName+" in non-existing class: " + className);
}

// CT.prototype.contain(name)
// name: name of class in string 
// return true if class table contain class with given name
// return false it does not contain class with given name and reached EmptyCT
CT.prototype.contain = 
	function(name){
		if(this.name === name)
			return true;
		else
			return this.prev.contain(name);
	};

// CT.prototype.getAllInstVarNames(name)
// return name of all instance variables including ones from super class in array format
CT.prototype.getAllInstVarNames = 
	function(name){
		if(this.name === name){
		  if(this.name === "Object")
		    return [];
		  var superClassInstVarNames = [];
		  if(this.superClassName !== "Object")
		    superClassInstVarNames = OO.ctable.getAllInstVarNames(this.superClassName);
		  return this.instVarNames.concat(superClassInstVarNames);
		}
		else
		  return this.prev.getAllInstVarNames(name);
	}
	
// CT.prototype.addMethod(className, methodName, implFn)
// className: string name of class to add method
// methodName: string name of method to be added
// implFn: body of method
// add method with given name to the class with given name
CT.prototype.addMethod = function(className, methodName, implFn){
	if(this.name === className){
		this.methods = new MethodList(methodName, implFn, this.methods);
	 	return true; 
	}
	else
		return this.prev.addMethod(className, methodName, implFn);
};

// CT.prototype.getClass(className)
// className: string name of class to search for
// return CT that has information about class with given name
// if not exist and reached EmptyCT, throw Error
CT.prototype.getClass = function(className){
		if(this.name === className)
			return this;
		else
			return this.prev.getClass(className);
};

// CT.prototype.callMethod(_this, className, methodName, args)
// execute method className.methodName(args) if exist
// if not exist, throw an Error
CT.prototype.callMethod = function(_this, className, methodName, args){
	if(className === this.name){
		if(this.methods.contain(methodName)){
			return this.methods.callMethod(_this, methodName, args);
		}
		else if(this.name === "Object")
	 		throw new Error("message not understood: trying to call not existing method: "+ className + "." + methodName );
		else
			return OO.ctable.callMethod(_this, this.superClassName, methodName, args);
	}
	else
	  return this.prev.callMethod(_this, className, methodName, args);
};

// CT.prototype.containVarNames(className,varName)
// className: string name of class that will be searched
// varName: string name of instance variable that will be searched
// return true if class with given name contain instance variable varName
// return fals if it does not find instacne variable with varName
CT.prototype.containVarNames = function(className,varName){
	if(this.name === className){
		var instVarNames = OO.ctable.getAllInstVarNames(this.name);
		for(var i=0; i<instVarNames.length ; i++){
			if(instVarNames[i] === varName)
			  return true;	
		}
		return false;
	}
	else
		return this.prev.containVarNames(className,varName);
	
};

//====================================================================================
// Translator for Project5 
//====================================================================================
O.transAST = function(ast) {
  return trans(ast);
};

// translate into string of javascript codes
function trans(ast){
  return match(ast[0],
  			"null", function(){return "null";},
			"true", function(){return "true";},
			"false", function(){return "false";},
			"number", function(){return ast[1];},
			"getVar", function(){return ast[1];},
			"getInstVar", function(){return "OO.getInstVar(this,"+"\""+ast[1]+"\""+")";},
			"exprStmt", function(){return trans(ast[1])},
			"send", function(){var rest= ast.slice(1); return trans_send(rest);
				},
			"setVar", function(){ return ast[1] + " = " + trans(ast[2])},
			"setInstVar", function(){ return "OO.setInstVar(this,"+ "\""+ast[1]+"\""+","+ trans(ast[2]) + ")";			
			 },
			"return", function(){
				if(isInBlock === true){
				  return "OO.returnByError("+trans(ast[1])+")";
				}
				else
				  return "return "+ trans(ast[1]);
				},
			"new", function(){var rest= ast.slice(1); return trans_new(rest);},
			"super", function(){var rest= ast.slice(1); return trans_superSend(rest);},
			"this", function(){return "_this";},
			"classDecl", function(){var rest= ast.slice(1); return trans_classDecl(rest);
			  },
			"methodDecl", function(){var rest= ast.slice(1); return trans_methodDecl(rest);
			  },
			 "block", function(){
				 var trans_stmts = [];
				 var ast_args = ast[1];
				 var ast_stmts = ast[2];
				 var ast_typeArr = [];
				 isInBlock = true;
				 for(var i=0;i<ast_stmts.length;i++){ //translate the stmts to String of javascript codes
					trans_stmts = trans_stmts.concat([trans(ast_stmts[i])]);
				 }
				 isInBlock = false;
				 //translate arg array to String format
				 var ast_args_string = "[";
				 for(var i=0; i<ast_args.length;i++){
					 if(i!==0)
					   ast_args_string += ",";
					 ast_args_string += "\"" + ast_args[i] + "\"";
				 }
				 ast_args_string += "]";
				 //translate stmts to String format
				 var ast_stmts_string = "[";
				 var ast_stmts_string_inString = "[";
				 for(var i=0; i<trans_stmts.length;i++){
					 if(i!==0){
					   ast_stmts_string += ",";
					   ast_stmts_string_inString += ",";
					 }
					 ast_stmts_string_inString += "\"" + trans_stmts[i] + "\"";
					 ast_stmts_string += trans_stmts[i];
				 }
				 ast_stmts_string += "]";
				 ast_stmts_string_inString += "]";
				 return "OO.instantiate(\"Block\"," + ast_args_string + "," /*+ ast_stmts_string+ ","*/ + ast_stmts_string_inString+")";
				 },
  			"program", function (){ var rest= ast.slice(1); 
			return trans_program(rest); },
  			"varDecls", function(){ var rest= ast.slice(1); 
			return trans_varDecls(rest); }
		  );
};

// trans_classDecl(classDecl_ast)
// translate and generate javascript codes for class declaration
function trans_classDecl(classDecl_ast){
	var js_codes = "OO.declareClass("+"\""+classDecl_ast[0]+"\""+","+"\""+classDecl_ast[1]+"\""+","+"[";
	var instVar_list = classDecl_ast[2];
	for(var i=0;i<instVar_list.length;i++){
	  if(i !== 0)
	    js_codes += ",";
	  js_codes += "\""+instVar_list[i]+"\"";
	}
	js_codes += "])";
	return js_codes; 
};

// trans_methodDecl(methodDecl_ast)
// translate and generate javascript codes for method declaration
function trans_methodDecl(methodDecl_ast){
	var js_codes = "OO.declareMethod("+"\""+methodDecl_ast[0]+"\""+","+"\""+methodDecl_ast[1]+"\""+", function(_this";
	//adding argument
	var arg_list = methodDecl_ast[2];
	for(var i=0; i<arg_list.length;i++){
	  js_codes += ","+	arg_list[i];
	}
	js_codes += ") {";
	//adding body of method
	var body_list = methodDecl_ast[3];
	for(var j=0; j<body_list.length;j++){
	  js_codes += trans(body_list[j]) +";\n";	
	}
	js_codes += "})";
	return js_codes;
};

// trans_superSend(superSend_ast)
// translate and generate javascript codes for calling method that is in the super class
function trans_superSend(superSend_ast){
	var getSuperClass_codes = "OO.getSuperClassName(this)";
	var js_codes = "OO.superSend("+getSuperClass_codes+",this,"+"\""+superSend_ast[0]+"\"";
	var i=1;
	for(;i<superSend_ast.length;i++){
		js_codes += "," + trans(superSend_ast[i]);
	}
	js_codes += ")"
	if( isInBlock === true)
	  return js_codes.replace(new RegExp("\"", 'g'), "quote540");
	return js_codes;	
};

// trans_new(new_ast)
// translate and generate javascript codes for instantiating new object
function trans_new(new_ast){
	var js_codes = "OO.instantiate("+"\""+new_ast[0]+"\"";
	var i=1;
	for(;i<new_ast.length;i++){
		js_codes += ","+trans(new_ast[i]);
	}	
	js_codes += ")";
	return js_codes;
};

// trans_superSend(send_ast)
// translate and generate javascript codes for calling method (exclusing method in super class)
function trans_send(send_ast){
	var js_codes = "OO.send("+trans(send_ast[0])+","+"\""+send_ast[1]+"\"";
	var i=2;
	for(;i<send_ast.length;i++){
		js_codes += "," + trans(send_ast[i]);
	}
	js_codes += ")";
	if( isInBlock === true)
	  return js_codes.replace(new RegExp("\"", 'g'), "quote540");
	return js_codes;
};

// trans_program(rest_ast)
// generate javascript codes that will be beginning of all translated program.
function trans_program(rest_ast){
	var js_codes = "OO.initializeCT();\n"; // initialize first
	var i=0;
	for(; i<rest_ast.length; i++){
		js_codes += trans(rest_ast[i]) +";\n"; // translate each piece of code 
	}
	return js_codes;
	
};

// trans_varDecls(keyvalue_pairs)
// translate and generate javascript codes for declaring variable
function trans_varDecls(keyvalue_pairs){
	var js_codes = "";
	var i=0;
	for(; i<keyvalue_pairs.length; i++){
		if( i !== 0)
		  js_codes += ";\n";
		js_codes += "var " + keyvalue_pairs[i][0] + " = " + trans(keyvalue_pairs[i][1]);
	}
	return js_codes;
};

// helper function for non-local return
OO.returnByError = function(retValue){
	return ["returnState170", retValue]; //special string returnState170, for handling non-local return
}

// exception class for non-local return
function returnException(exceptionType, retval){
	this.exceptionType = exceptionType;
	this.retval = retval;	
}
//====================================================================================
//Codes from Project3, match.js - Pattern Matcher for the JavaScript
//====================================================================================
var _ = "wildcard";

function when(cond) {	
  var funval = function(x) { return cond.call(this,x);};	
  return ["whenWhen", funval]; // user inputted array might possibly have "when" as an first element, 
                                // so I am using special string "whenWhen" to distinguish with user array
}

function many(target){
  return ["manyMany", target];
}

/*  isArraysEqual(value, pat) - compare two array (specialize for comparing value/pattern arrays)
 value: array that contain values
 pat: array that contain patterns
 return: true if two array patterns match, 
         else return false
*/
function isArraysEqual(value, pat){
	var i=0;
	var k=0;
	for(; i<value.length && k<pat.length ; i++, k++){ //all elements in arrays must be same
	  //need handle case for special pattern: "many"
	  if((pat[k] instanceof Array) && (pat[k][0] === "manyMany")){ //conitnue to compare until match fail
		var spPattern = pat[k];
		  var targetPattern = spPattern[1];
		  for(var inner_index=i; inner_index<value.length; inner_index++){
			if(isPatternMatch(value[inner_index], targetPattern) === false)
			  break;
		  } //end of for loop
		  i = inner_index-1; //going to loop again, so I want "i" to remain same on next looop
	  }//end of if pat instacneof array && .... 
	  else if(isPatternMatch(value[i], pat[k]) === false)
	  	return false;
	}//end of for loop
	return true;
}

/* isPatternMatch(value, pat): see if value matches with pattern
   return: true if pattern match, 
           false if pattern does not match
 */
function isPatternMatch(value, pat){
  if(pat === "wildcard")
    return true;
  else if(pat === value)
    return true;
  else if( pat instanceof Array){ //for predicate pattern
        if(pat[0] === "whenWhen")
		  return pat[1].call(this,value);
  }//end of else if(pat instance of Array) 
  if((value instanceof Array) && (pat instanceof Array)) //for comparing two arrays
    return isArraysEqual(value,pat);
	
  return false;
}

// getBindingFromPattern(value,pat) - try to get bindings between value and pattern
// return: array that contain value of arguments
function getBindingFromPattern(value,pat){
  if(pat === "wildcard")
    return [value];
  else if(pat === value)
    return [];
  else if( pat instanceof Array){
	// if"when" pattern  
	if(pat[0] === "whenWhen"){
		return [value];
	}  
  }
  if ((value instanceof Array) && (pat instanceof Array)){
	var args_list = []; 
	var i=0;
	var k=0;
	for(;i<value.length && k<pat.length ;i++, k++){
	  if((pat[k] instanceof Array) && (pat[k][0] === "manyMany")){
		var spPattern = pat[k];
		var inner_list = [];
		  var targetPattern = spPattern[1];
		  for(var inner_index=i; inner_index<value.length; inner_index++){
			if(isPatternMatch(value[inner_index], targetPattern) === false)
			  break;
			else
			  inner_list = inner_list.concat(value[inner_index]);
		  } //end of for loop
		  i = inner_index-1;
		  args_list = args_list.concat([inner_list]);
	  }//end of if pat instacneof array && .... 
	  else
	    args_list = args_list.concat(getBindingFromPattern(value[i],pat[i]));	
	}
	return args_list;
  }
  throw new Error("Nothing was matched for getBindingFromPattern, call isPatternMatch first to check"); 
}

//return resulting value of corresponding matched function or throw exception
function match(value /* , pat1, fun1, pat2, fun2, ... */) {
  // argument[0] is value
  for(var i=1; i<arguments.length; i=i+2){
    var pat = arguments[i];
    var fun = arguments[i+1];
	if(isPatternMatch(value,pat)){
	  var arg_bindings = getBindingFromPattern(value,pat);
	  return fun.apply(this,arg_bindings);
	}
  } //end of for(var i=1; ...) loop
  throw new Error("match failed");
}
