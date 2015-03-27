
//By Min Hyoung Rhee from Prototype Programming in UCLA

// -----------------------------------------------------------------------------
// Part I: Rule.prototype.makeCopyWithFreshVarNames() and
//         {Clause, Var}.prototype.rewrite(subst)
// -----------------------------------------------------------------------------
var rulec = 0; //global variable to generate fresh variable name for the rules

// makeCopyWithFreshVarNames():  
// return: copy of receiver as new Rule Class in which all variable names are replaced with fresh variable names.
Rule.prototype.makeCopyWithFreshVarNames = function() {
//	var randomNumb = Math.floor((Math.random() * 1000000) + 1); //generate random # between 1 and 1,000,000
    var randomNumb = rulec;
	rulec++;
	return new Rule(this.head.fresh(randomNumb), freshAll(this.body, randomNumb));
};

// freshAll(clss, randomNumb):
// clss: array of Clause and/or Var class.
// randomNumb: integer value that will be attached to the fresh variable name at the end.
// return: array of Clause and/or Var class where all variable names are replaced with fresh names
function freshAll(clss, randomNumb){
  var new_clss = [];
  for(var i=0; i<clss.length; i++){
	  new_clss = new_clss.concat([clss[i].fresh(randomNumb)]);
  }
  return new_clss;
}

//Clause.prototype.fresh(randomNumb):
// randomNumb: integer value that will be attached to the fresh variable name at the end.
// return: copy of receiver as new Clause class where where all variable names are replaced with fresh names.
Clause.prototype.fresh = function(randomNumb){
	return new Clause(this.name, freshAll(this.args, randomNumb)/* freshArgs(this.args)*/);
};

// Var.prototype.fresh(randomNumb):
// randomNumb: integer value that will be attached to the fresh variable name at the end.
// return: copy of receiver as new Var class where wherevariable name are replaced with fresh name.
Var.prototype.fresh = function(randomNumb){
	return new Var(this.name + "_fresh" + randomNumb);
}

/* Clause.prototype.rewrite(subst)
   subst: Subst class where substitution rules that will be applied to this Clause is defind.
   return: copy of receiver as new Clause class where all variables are rewritten according to
   the substitution rules if defind.
*/
Clause.prototype.rewrite = function(subst) {
	return new Clause(this.name, substAll(this.args, subst));
};

/* Var.prototype.rewrite(subst)
   subst: Subst class where substitution rules that will be applied to this Clause is defind.
   return: copy of receiver as new Var class where all variables are rewritten according to
   the substitution rules if defind.
*/
Var.prototype.rewrite = function(subst) {
	var rewriteResult = subst.lookup(this.name);
	if(rewriteResult === undefined)
	  return new Var(this.name);
	else{
	  isChanged = true;
	  return rewriteResult;
	}
};

/* substAll(args,subst)
   args: array of Clause and/or Var class that will be rewritten according to the substitution rule.
   subst: Subst class where substitution rules that will be applied to this Clause is defind.
   return: new array of Clause and/or Var class that are rewritten according to the substitution rule.
*/
function substAll(args, subst){
	var new_args = [];
	for(var i=0; i<args.length; i++){
	  var rewriteResult = args[i].rewrite(subst);
	  	new_args = new_args.concat([rewriteResult]);	
	}
	return new_args;	
}
// -----------------------------------------------------------------------------
// Part II: Subst.prototype.unify(term1, term2)
// -----------------------------------------------------------------------------
/* Subst.prototype.unify(term1, term2)
   term1,term2: Clause/Var class that will be unified if possible.
   return: new Subst class that contain whatever bindings necessary in order to unify the given two terms.
*/
Subst.prototype.unify = function(term1, term2) {
	var isTerm1Var = (term1 instanceof Var);
	var isTerm2Var = (term2 instanceof Var);
	var isTerm1Cls = (term1 instanceof Clause);
	var isTerm2Cls = (term2 instanceof Clause);
	//case 1: X = Y -> {X:Y}, actually stored as {"X" : new Var("Y")}
	if(isTerm1Var && isTerm2Var){ 
	   var new_subst = this.clone();
	   if(this.lookup(term2.name) !== undefined){ // there exist mapping {term2.name: atom}
	     if(this.lookup(term1.name) !== undefined){ //there already exist mapping for term1.name
		   if(this.lookup(term2.name) !== this.lookup(term1.name)) //then term1 === term2
		     throw new Error("unification failed");
		 }
		 else
	       new_subst = new_subst.bind(term1.name, term2.rewrite(this));
	   }
	   else

	     new_subst = new_subst.bind(term2.name, term1.rewrite(this));
	}
	//case 2: t = X
	else if (!(isTerm1Var) && isTerm2Var){ 
	   var new_subst = this.clone();
	   if(this.lookup(term2.name) !== undefined){ //there already exist mapping for term2.name
		//then term1 must equal to term2
		 if(!(isClauseEqual(this, term1, term2)))
		    throw new Error("unification failed");
	   }
	   else
	     new_subst = new_subst.bind(term2.name, term1.rewrite(this));  
	}
	//case 3: X = t
	else if(isTerm1Var && !(isTerm2Var)) { 
	   var new_subst = this.clone();
	   if(this.lookup(term1.name) !== undefined){ //there already exist mapping for term2.name
	 	if(!(isClauseEqual(this, term1, term2)))
		    throw new Error("unification failed");
	   }
	   else
	     new_subst = new_subst.bind(term1.name, term2.rewrite(this));
	}
	//case 4:  t = t
	else if(isTerm1Cls && isTerm2Cls){
	   if(!(term1.name === term2.name))
	     throw new Error("unification failed");
	   var new_subst = this.clone();
	   if(term1.args.length === 0 && term2.args.length === 0)
	     return new_subst;
	   if(term1.args.length !== term2.args.length) // assume: term1.args.length === term2.args.length
		 throw new Error("unification failed");
	   for(var i=0; i<term1.args.length; i++){ 
	     new_subst = new_subst.unify(term1.args[i], term2.args[i])
	   }
	}
	else
	  throw new Error("unification failed");

	var tempArr = [];
	//reverse the order of subsitution rules
	for(var varName in new_subst.bindings){
		tempArr = [[varName, new_subst.lookup(varName)]].concat(tempArr);
	}
	var newSubst = new Subst();
	for(var i=0; i<tempArr.length; i++){
	  	newSubst.bind(tempArr[i][0], tempArr[i][1]);
	}
	// rewrite all clauses and variables with reversed substitution rules
	newSubst = newSubst.rewriteAll(newSubst);
	return newSubst;
};

var isChanged = false; //see if any changes were made in the process of rewriting substitution rules.

/* Subst.prototype.rewriteAll(new_subst)
   new_subst: Subst class that contain substitution rules that will be used in this function
   return: new Subst class where only variables remaining are not mapped variables.
*/
Subst.prototype.rewriteAll = function(new_subst){
	var isDone = true;
    isChanged = false;
	for(var varName in new_subst.bindings){
	  var target = new_subst.lookup(varName); 
	  var targetrw = target.rewrite(new_subst);
	  new_subst = new_subst.bind(varName, targetrw);
	}//end of for loop
	if(!(isChanged))
	  return new_subst;
	else //if any changes were made during rewriting clauses/variables start again.
	  return new_subst.rewriteAll(new_subst);	  
};

// -----------------------------------------------------------------------------
// Part III: Program.prototype.solve()
// -----------------------------------------------------------------------------

// Program.prototype.solve
// return: iterator that knows current solution and knows how to obtain next solution.
Program.prototype.solve = function() {
	var it = new iterator(this.rules, this.query);
	it.solver.pastSolns = [];
	return it;
};

// iterator(rules,queries):
// iterator class that has next method to request next solution if available. 
// rules: array of Rule class that will contain rules to be used to solve queries.
// queries: array of Clauses/Variables class that solver will looking for the solution.
function iterator(rules,queries){
  this.solver = new Solver(rules,queries);
  this.icount = 0;
}

// iterator.prototype.next()
// return: solve for next solution and return it.
iterator.prototype.next = function(){
   rulec=0;
   testCount =0;
   this.solver.ruleIndexes[this.solver.queries.length-1] = this.solver.ruleIndexes[this.solver.queries.length-1] + 1;
   try{   
	 var ret = this.solver.getSoln(this.solver);
	this.icount++;

	 return ret;
	 
   }catch(err){
	if(err.message === "end of solution"){
	  return false;
	}
	else{
	  throw new Error(err.message);
	}
   }//end of catch
};

// query element for goal (array of query elements)
function qe(query){ 
  this.q = query;
  this.ruleIndex = 0;	
}

// Solver(rules, queries): (constructor for the) class that contain neccessary information to 
// find solution and next solution if asked.
// rules: array of Rule class that will contain rules to be used to solve queries.
// queries: array of Clauses/Variables class that solver will looking for the solution.
function Solver(rules, queries){
  this.rules = 	rules;
  this.queries = queries;
  this.ruleIndex = 0;
  this.ruleIndexes = [];
  this.qcountForStartBody = [];
  this.howManyToRemove = [];
  this.isSettingUp = false;
  this.isFirstTime = true;
  for(var i=0; i<queries.length; i++){
	this.ruleIndexes[i] = 0; 
  }
  this.ruleIndexes[queries.length-1] = -1;

}


/* Solver.prototype.getSoln(solver)
   solver: Solver class that will be used to solve for the next solution.
   return: new Subst class that contain bindings of varibles from the given queries.
*/
Solver.prototype.getSoln = function(solver){
//  var goal = solver.queryArray.slice();
  if(solver.isFirstTime !== true){
    solver.isSettingUp = true;
  }
  solver.isFirstTime = false;
  var new_subst = new Subst();
  var soln = solver.solveSubstRecurQuery(solver, new_subst, 0);	
  return soln;
}

//=================================================================================

//try to deal with query in position qcount in queries array
/* Solver.prototype.solveSubstRecurQuery(solver, new_subst, qcount): function is used to traverse the
   each query in solver.queries array until it reach end of array to find solution.
   solver: class that contain neccessary information to find solution and next solution if asked.
   new_subst: Subst class that contain substitution rules that will be used in unification
   qcount: index of query in solver.queries array that will be used for the unification.
   return: new Subst class that represent solution by containing neccessary bindings for the variables
   in the given queries.
   exception: if it tried all queries with all rules and cannot find 
   more solution, throw Error("end of solution") to let caller knows that no more solution is available.
*/
Solver.prototype.solveSubstRecurQuery = function(solver, new_subst, qcount){
	var try_subst = new Subst();
	if(this.isSettingUp){
	  if(this.queries.length-1 === qcount)
	  	this.isSettingUp = false;
	}
	try{
		try_subst = solver.solveSubstRecurRule(solver, new_subst, qcount);
	}
	catch(err){
		  if(err.message === "no solution"){
			if(qcount === 0)
			  throw new Error("end of solution");
			 else{
			   var indexForQcount = this.qcountForStartBody.indexOf(qcount);
			   if(indexForQcount >= 0){
				   var numbToRemove = this.howManyToRemove[indexForQcount];
				   
				   var frontQueries = this.queries.slice(0, qcount);
				   var backQuerie = this.queries.slice(qcount+numbToRemove);
				   var new_queries = frontQueries.concat(backQuerie);
				   this.queries = new_queries;
				   
				   var frontRuleIndexes = this.ruleIndexes.slice(0,qcount);
				   var backRuleIndexes = this.ruleIndexes.slice(qcount+numbToRemove);
				   var new_ruleIndexes = frontRuleIndexes.concat(backRuleIndexes);
				   this.ruleIndexes = new_ruleIndexes;
				   
				   this.qcountForStartBody.splice(indexForQcount, 1);
 				   this.howManyToRemove.splice(indexForQcount, 1);   
			   }
			   throw new Error("no solution for this query");
			 }
		  }
		  else
		    throw err;
	}
	if(this.queries.length-1 > qcount){ //there are more query after this one
    	try{
	    	try_subst = solver.solveSubstRecurQuery(solver, try_subst, qcount+1); //solve next query 
	    }catch(err){
		  if(err.message === "no solution for this query"){
		  	this.ruleIndexes[qcount] = this.ruleIndexes[qcount] + 1;
			  return solver.solveSubstRecurQuery(solver, new_subst, qcount);
		  }
		  else
		    throw new Error(err.message + " throwing from RecurQuery");
	  }
	}
	return try_subst;
};

var testCount =0;

// apply rule to query in position index qcount at queries array
/* Solver.prototype.solveSubstRecurRule(solver, new_subst, qcount): function try to apply
   rule in position solver.ruleIndexes[qcount] to query in position qcount.
   solver: class that contain neccessary information to find solution and next solution if asked.
   new_subst: Subst class that contain substitution rules that will be used in unification
   qcount: index of query in solver.queries array that will be used for the unification.
   return: new Subst class that represent solution by containing neccessary bindings for the variables
   in the given queries.
   exception: if unification failed and it tried all the rules, throw Error("no solution") to let
   caller move on to next query in solver.queries array.
*/
Solver.prototype.solveSubstRecurRule = function(solver, new_subst, qcount){
	var ruleIndex = this.ruleIndexes[qcount];
	if(this.rules.length <= ruleIndex){ //ruleIndex
	  this.ruleIndexes[qcount] = 0;
	  throw new Error("no solution");	
	}
	rulec =qcount;
	var fresh_rule = this.rules[ruleIndex].makeCopyWithFreshVarNames();
	var newSubst = new Subst();
	try{
	  newSubst = new_subst.unify(fresh_rule.head.rewrite(new_subst), this.queries[qcount].rewrite(new_subst));
	}catch(err){
		if(err.message === "unification failed"){
		    this.ruleIndexes[qcount] = ruleIndex + 1;
		    return solver.solveSubstRecurRule(solver, new_subst, qcount); //search same query,next rule
		}//end of if === "unification failed"
		else
		  throw new Error(err.message + " throwing from RecurRule");
	}
	new_subst = newSubst;
	testCount++;

	try{
	if(this.isSettingUp === false)
	 if(this.rules[ruleIndex].body.length !== 0){
	  var frontQueries = this.queries.slice(0, qcount+1);
	  var backQueries = this.queries.slice(qcount+1);
	  var frontRuleIndexes = this.ruleIndexes.slice(0,qcount+1); 
	  var backRuleIndexes = this.ruleIndexes.slice(qcount+1);
	  var new_queries = frontQueries;
	  var new_ruleIndexes = frontRuleIndexes;
	  
	  for(var i=0; i<this.rules[ruleIndex].body.length; i++){
		  new_queries = new_queries.concat([fresh_rule.body[i].rewrite(new_subst)])
		  new_ruleIndexes = new_ruleIndexes.concat([0]);		  
	  }
	  new_queries = new_queries.concat(backQueries);
	  new_ruleIndexes = new_ruleIndexes.concat(backRuleIndexes);
	  this.queries = new_queries;
	  this.ruleIndexes = new_ruleIndexes;
 	  this.qcountForStartBody = this.qcountForStartBody.concat([qcount+1])
 	  this.howManyToRemove = this.howManyToRemove.concat([this.rules[ruleIndex].body.length])
	 }
	}catch(err){throw new Error(err.message + "throwing from added codes");}
	if(testCount>0)
	return new_subst;
};


// isClauseEqual(subst, term1, term2)
// test if two Clause are same in given Substitution (existence of any unmapped Var will return false)
function isClauseEqual(subst, term1, term2){
	var term1rw = term1.rewrite(subst);
	var term2rw = term2.rewrite(subst);
	if(term1rw instanceof Clause){
	  if(term2rw instanceof Clause){
	    if(term1rw.args.length !== term2rw.args.length)
		  return false;
		if(term1rw.name !== term2rw.name)
		  return false;
		for(var i=0; i<term1rw.args.length; i++){
		  var argTestResult = isClauseEqual(subst, term1rw.args[i], term2rw.args[i]);
		  if(argTestResult === false)
		    return false;
		}
		return true;
	  }
	  else
	    return false;
	}
	return false;
}