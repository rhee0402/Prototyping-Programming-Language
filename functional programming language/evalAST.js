// Min Hyoung Rhee
// evalAST.js

F.evalAST = function(ast) {
  var env = new EmptyEnv();
  return ev(ast,env);
};

function ev(ast,env){
  if(typeof ast === "number")
    return ast;
  if(ast === true || ast === false)
    return ast;
  if (ast === null)
    return null;
  else{
    var tag = ast[0];
    switch(tag){
	  // ast == ["id", x]
      case "id": //if identifier, return value by looking up in the environment
        var x = ast[1];
        return env.lookup(x);
      case "+": //  ast == ["+", x ,y], return x+y
	    var x = ast[1];
        var y = ast[2];
        var result_x = ev(x,env);
        if(typeof result_x !== "number")
          throw new Error("trying + to non-number varaible");
        var result_y = ev(y,env);
        if(typeof result_y !== "number")
          throw new Error("trying + to non-number varaible");
        return result_x + result_y;
	  case "-": // ast == ["-", x ,y], return x-y
        var x = ast[1];
        var y = ast[2];
        var result_x = ev(x,env);
        if(typeof result_x !== "number")
          throw new Error("trying - to non-number varaible");
        var result_y = ev(y,env);
        if(typeof result_y !== "number")
          throw new Error("trying - to non-number varaible");
        return result_x - result_y;
      case "*": // ast == ["*", x ,y], return x*y
        var x = ast[1];
        var y = ast[2];
        var result_x = ev(x,env);
        if(typeof result_x !== "number")
          throw new Error("trying * to non-number varaible");
        var result_y = ev(y,env);
        if(typeof result_y !== "number")
          throw new Error("trying * to non-number varaible");
        return result_x * result_y;
      case "/": // ast == ["/", x ,y], return x/y
        var x = ast[1];
        var y = ast[2];
        var result_x = ev(x,env);
        if(typeof result_x !== "number")
          throw new Error("trying / to non-number varaible");
        var result_y = ev(y,env);
        if(typeof result_y !== "number")
          throw new Error("trying / to non-number varaible");
        return result_x / result_y;
      case "%": // ast == ["%", x ,y], return x%y
        var x = ast[1];
        var y = ast[2];
        var result_x = ev(x,env);
        if(typeof result_x !== "number")
          throw new Error("trying % to non-number varaible");
        var result_y = ev(y,env);
        if(typeof result_y !== "number")
          throw new Error("trying % to non-number varaible");
        return result_x % result_y;
      case "=": // ast == ["=", x ,y], return x===y
        var x = ast[1];
        var y = ast[2];
        var result_x = ev(x,env);
        var result_y = ev(y,env);
        return result_x === result_y;
      case "!=": // ast == ["!=", x ,y], return x!=y
        var x = ast[1];
        var y = ast[2];
        var result_x = ev(x,env);
        var result_y = ev(y,env);
        return result_x !== result_y;
      case "<": // ast == ["<", x ,y], return x<y
        var x = ast[1];
        var y = ast[2];
        var result_x = ev(x,env);
        if(typeof result_x !== "number")
          throw new Error("trying < to non-number varaible");
        var result_y = ev(y,env);
        if(typeof result_y !== "number")
          throw new Error("trying < to non-number varaible");
        return result_x < result_y;
      case ">": // ast == [">", x ,y], return x>y
        var x = ast[1];
        var y = ast[2];
        var result_x = ev(x,env);
        if(typeof result_x !== "number")
          throw new Error("trying > to non-number varaible");
        var result_y = ev(y,env);
        if(typeof result_y !== "number")
          throw new Error("trying > to non-number varaible");
        return result_x > result_y;
      case "and": // ast == ["and", x ,y], return x&&y
        var x = ast[1];
        var y = ast[2];
        var result_x = ev(x,env);
        if(result_x !== true && result_x !== false)
          throw new Error("non-boolean varaible for and operator");
        var result_y = ev(y,env);
        if(y !== true && y !== false)
          throw new Error("non-boolean varaible for and operator"); 
        return x && y;
      case "or": // ast == ["or", x ,y], return x||y
        var x = ast[1];
        var y = ast[2];
        var result_x = ev(x,env);
        if(result_x !== true && result_x !== false)
          throw new Error("non-boolean varaible for or operator");
        var result_y = ev(y,env);
        if(y !== true && y !== false)
          throw new Error("non-boolean varaible for or operator");
        return x || y;
      case "if": // ast == ['if', e1, e2, e3], if e1 then e2 else e3
        var e1 = ast[1];
        var e2 = ast[2];
        var e3 = ast[3];
        var test_result = ev(e1,env);
        if((test_result === true) || (test_result === false)){
          if(test_result === true)
            return ev(e2,env);
          else
            return ev(e3,env);
        }
        else
          throw new Error("non-boolean varaible for if expression");
      case "let": //let rec, ast == ['let', x, e1, e2], let x=e1 in e2
        var x = ast[1];
        var e1 = ast[2];
        var e2 = ast[3];
		var new_env = new Env(x, "empty", env);
		var e1_result = ev(e1,new_env);
		new_env.set(x,e1_result);
		return ev(e2,new_env);
      case "fun": // ast == ['fun', [x1, x2, …], e], fun x1 x2 … -> e
        var args = ast[1];
        var body = ast[2];
        return ["closure", args, body, env];
      case "call": // ast == ['call', ef, e1, e2, …], ef e1 e2 …
        var ef = ast[1];
        var in_args = ast.slice(2);
        var ef_result = ev(ef,env); 
        var ef_result_tag = ef_result[0];
        if(ef_result_tag !== "closure")
          throw new Error("trying to call non-function expression:" + ef_result_tag);
        var func_args = ef_result[1];
        var func_body = ef_result[2];
        var func_env = ef_result[3];
        var new_env = func_env;
        if(in_args.length > func_args.length)
          throw new Error("providing too many arguments");
		var i=0; 
        for(;i<in_args.length;i++){
          new_env = new Env(func_args[i],ev(in_args[i],env),new_env);
        }
		if(in_args.length < func_args.length)
		  return ["closure", func_args.slice(i), func_body, new_env];
        return ev(func_body,new_env);
      case "cons": // ast == ['cons', e1, e2], e1::e2
        var e1 = ast[1];
        var e2 = ast[2];
        return ["cons", ev(e1,env), ev(e2,env)];
      case "match": // ast == ['match', e, p1, e1, p2, e2, …], match e with p1 -> e1 | p2 -> e2 …
        var e = ast[1];
        var p1 = ast[2];
        var e1 = ast[3];
        var does_match = isPatternMatch(e, p1, env);
        if(does_match !== false){
          var new_env = setPatternMatch(e,p1,env);
          return ev(e1,new_env);
        }
        else{
		  var rest = ast.slice();
		  rest.splice(2,2); //remove p1 and e1 since they don't match with our e
		  if(rest.length < 4) //reached end of possible match list, no matching
		   throw new Error("no possible matching found in match expression: "+ev(e,env));
          return ev(rest,env);
		}
      case "set": // ast == ['set', x, e], x := e
        var x = ast[1];
        var e = ast[2];
        var result_e = ev(e,env);
        return env.set(x,result_e);
      case "seq": // ast == ['seq', e1, e2] , e1; e2
         var e1 = ast[1];
         var e2 = ast[2];
         ev(e1,env);
         return ev(e2,env);
      case "listComp": // ast == ['listComp', e, x, elist, [, epred]], [e | x <- elist [, epred]]
         var e = ast[1];
         var x = ast[2];
         var elist_ast = ast[3];
		 var elist = ev(elist_ast,env);
		 if( elist === [])
		   return null;
		 if(elist === null)
		   return null;
		 else if(elist[0] === "cons"){
			var sub_env = new Env(x, ev(elist[1],env), env);
			var rest = elist[2];
			if(ast.length > 4){ //then we have predicate to test
			  var ePred = ast[4];
			  if(ev(ePred,sub_env) === true)
			    return ["cons", ev(e,sub_env), ev(["listComp", e, x, rest, ePred])];
		      else //does not satisfy predicate, so skip this element
			    return ev(["listComp", e, x, rest, ePred]);
			}
			else
			  return ["cons", ev(e,sub_env), ev(["listComp", e, x, rest])];
	     }
      case "delay":
	     var e = ast[1];
         return ["closure", [], e, env];
	  case "force":
	     var e = ast[1]; 
		  var e_result = ev(e,env);
         var delayed_func = ["fun", [], e_result[2]];
		 return ev(["call",delayed_func],e_result[3]);
	  case "closure": //for closure, just return itself
	    return [ast[0], ast[1], ast[2], ast[3]];
      default:
        throw new Error("unsupported:" + tag);
    }
  }
};

// isPatternMatch(ast_e,p1,env)
// return: true if pattern does match;
//         false if pattern does not match
function isPatternMatch(ast_e,p1,env){
  var e = ev(ast_e,env);
  if(p1 === e)
    return true;
  if(p1 === null){ //need to check this first, else null[0] will throw exception
	if(e === null)
	  return true;
	else
	  return false; 
  }
  if(p1[0] === "_") //wild card matches everything
    return true;
  if(p1[0] === "id")
    return true;
  if(e === null) //p1 has more components, does not match
    return false;
  else if((p1[0] === "cons") && (e[0] === "cons"))
    return ((isPatternMatch(e[1], p1[1])) && 
                  (isPatternMatch(e[2], p1[2])));
   else
     return false;
};

// setPatternMatch(ast_e,p1,original_env)
// return new Environment by converting array format to Env type
function setPatternMatch(ast_e,p1,original_env){
  var env_array= setPatternMatch_rec(ast_e,p1,original_env);
  var target = [];
  for(i = 0; i < env_array.length; i++){
    target = env_array[i]; //target is in form: [id,value]
    original_env = new Env(target[0],target[1],original_env);
  }
  return original_env;
};

// setPatternMatch_rec(ast_e,p1,original_env)
// return new Environment in nested array format(assuming given pattern does match)
function setPatternMatch_rec(ast_e,p1,original_env){
  var e = ev(ast_e,original_env);
  if(p1 === e)
    return [];
  if(p1 === null)
    if(e === null)
	  return [];
	else //this cannot happen since we should check it using isPatternMatch function first
	  throw new Error("#1 unmatch occured in setPatternMatch function(this should not happen)"); 
  if(p1[0] === "_")
    return [];
  if(p1[0] === "id")
    return [[p1[1],e]];
  else if((p1[0] === "cons") && (e[0] === "cons"))
    return setPatternMatch_rec(e[1],p1[1],original_env).concat(setPatternMatch_rec(e[2],p1[2],original_env));
  else
    throw new Error("#2 unmatch occured in setPatternMatch function(this should not happen)"); 
};

// Environment will be stored as Linked List.
// Env(name, value,parent): single environment element entry that points to next Env element entry.
// name: name of variable (i.e. identifier)
// value: value of variable
// parent: next environment entry
function Env(name,value,parent){
  this.name = name;
  this.value = value;
  this.parent = parent;
};

// EmptyEnv will be used to represent end of environment. (i.e. end of Linked List)
function EmptyEnv(){
};

EmptyEnv.prototype.lookup = 
    function(name){
      throw new Error(name + " not found for lookup");
    }; 

Env.prototype.lookup =
    function(name){
      if(this.name === name)
        return this.value;
      else
        return this.parent.lookup(name);
    };


EmptyEnv.prototype.set =
    function(name,value){
       throw new Error(name + " not found for set");
     };

Env.prototype.set =
    function(name,value){
       if(this.name === name){
         this.value = value;
         return this.value;  
       }
       else
         this.parent.set(name,value);
    };
