var UniTest = 
{
	playerNames : ["tweek", "jmpp", "flex", "pilou", "potatoe"],

	creation : function(cPlayer)
	{

		var players = [];

		for (var i = 0; i < cPlayer; i++)
		{
			var name = this.playerNames[Math.floor(Math.random() * this.playerNames.length)];

			players[i] = game.addPlayer(name + "_" + i, {name:name});
		}

		console.log("[UniTest] @creation - Create " + players.length + " players", game.players);

		return players;
	},

	transformToJager : function()
	{
		var jager = null;

		for(var token in game.players)
		{
			if(jager === null || Math.random() > .5)
			{
				jager = game.players[token];
			}
		}

		if(jager === null)
		{
			jager = UniTest.creation(1)[0];
		}

		jager.transformToJager();

		console.log("[UniTest] @transformToJager - Transform player " + jager.name + " to jager in " + jager.transformDuration + "ms");
	},

	collision : function(cPlayer)
	{
		if(cPlayer < 2)
		{
			console.error("[UniTest] @collision - Can't test collision with less than 2 players");
		}

		UniTest.creation(cPlayer);

		UniTest.transformToJager();

		UniTest.move();
	},

	move : function()
	{
		for(var token in game.players)
		{
			var player = game.players[token];

			if(player.isJager === false)
			{
				if(player.target === undefined || Math.random() > .99 ||
					isCollide(player, {position:{x:player.target.x,y:player.target.y},scale:{x:player.scale.x,y:player.scale.y}}) === true)
				{
					player.target = new Vector2(canvas.position.x + (canvas.scale.x * .9) * Math.random(), canvas.position.y + (canvas.scale.y * .9) * Math.random());
				}

				player.moveTo(player.target);
			}
			else
			{
				UniTest.chase(player);
			}
		}

		requestAnimationFrame(UniTest.move);
	},

	chase : function(jager)
	{
		if(jager === undefined || jager.isJager === false)
		{
			console.error("[UniTest] @chase - Can't chase others with an invalid jager !");
		}

		for(var token in game.players)
		{
			var other = game.players[token];

			if(other === jager || other.isTransform === true)
			{
				continue;
			}
			else if(jager.prey === undefined)
			{
				jager.prey = other;
			}

			if(jager.target === undefined)
			{
				jager.target = new Vector2(jager.prey.position.x, jager.prey.position.y);
			}
			else
			{
				jager.target.set(jager.prey.position.x, jager.prey.position.y);
			}

			jager.moveTo(jager.target);
		}
	}
}