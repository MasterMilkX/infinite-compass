function set(name, actions){
	this.name = name;
	this.actions = actions;
}	
function stat(name, props){
	this.name = name;
	this.props = props;
}
function prop(id, val){
	this.id = id;
	this.val = val;
}

var botSets = [
	new set("a", [ "health", "money", "weapons", "blood" ]),
	new set("b", [ "health", "weapons", "money", "blood" ]),
	new set("c", [ "weapons", "blood", "health", "money" ]),
	new set("d", [ "money", "health", "weapons", "blood" ]),
	new set("e", [ "health", "money", "weapons" ])
];

var botStats = [
	new stat("a", [new prop("maxHealth", 200),
					  new prop("minMoney", 10),
					  new prop("pathFind", "smart")])
];