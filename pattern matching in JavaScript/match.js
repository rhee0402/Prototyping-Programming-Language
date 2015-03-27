// BY MIN HYOUNG RHEE
// Project 3
// match.js
// see index.html for the syntax, test cases, playground.

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
