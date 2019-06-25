import core\mods\noppes\Java.js;

//

function getMCHeadFromBlock(block) {
    var blockitem = API.getIWorld(0).createItem(block.getName(), (block.hasTileEntity() ? 0 : block.getMetadata()), 1);
    var blockname = blockitem.getItemName().toLowerCase().replaceAll(" ", "_");
    //var blockname = blockitem.getName().split(":")[1].toLowerCase();

    //strict search
    if(Object.keys(MCHeads).indexOf(blockname) > -1) {
        return getMCHeadItem(blockname);
    }
    //try loose search
    var mt = [];
    for(var i in MCHeads as mchead) {
        if(occurrences(mchead.name.toLowerCase(), blockname) > 0) {
            return getMCHeadItem(mchead.name);
        }
        if(occurrences(blockname, mchead.name.toLowerCase()) > 0) {
            mt.push(mchead);
        }
    }

    mt.sort(function(a,b){
        var al = a.name.length;
        var bl = b.name.length;
        if(al < bl) return -1;
        if(al > bl) return 1;

        return 0;
    });
    mt.reverse();
    if(mt.length > 0) {
        return getMCHeadItem(mt[0].name);
    }

    return null;
}

function getMCHeadItem(headname) {
    if(Object.keys(MCHeads).indexOf(headname) > -1) {
        var hd = MCHeads[headname];
        var head = API.getIWorld(0).createItem("minecraft:skull", 3, 1);
        var skullNbt = API.stringToNbt('{SkullOwner:{Id:"'+hd.id+'",Properties:{textures:[{Value:"'+hd.value+'"}]}}}');
        head.getNbt().merge(skullNbt);
        head.setCustomName(ccs("&r"+headname.replaceAll("_", " ")));

        return head;
    }

    return null;
}

function getMCHeadGiveCommand(mchead) {
    return '/give @p skull 1 3 {display:{Name:"'+mchead.name+'"},SkullOwner:{Id:"'+mchead.id+'",Properties:{textures:[{Value:"'+mchead.value+'"}]}}}';
}

function getMCHeadNameById(id) {
    for(var m in MCHeads as mchead) {
        if(mchead.id == id) {
            return m;
            break;
        }
    }
    return null;
}

var MCHeads = {
    "Nutella": {
	"name": "Nutella",	"id": "014df015-7eba-4ad0-a0e0-83164b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTE1ZGNiMmRhMDJjZjczNDgyOWUxZTI3M2UzMDI1NjE3ZDgwNzE1MTZmOTUzMjUxYjUyNTQ1ZGE4ZDNlOGRiOCJ9fX0=",
},
"Vegemite": {
	"name": "Vegemite",	"id": "3fd44f85-9f07-4a4e-9854-ee5747",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWU4ODkwODc0YTMwNjZmNDI2ZTY2ZTM3NDM4ZjQ1YWIyOWE1YmYyNTgyZGI3M2NiNGNmZjY5NTRhNTc4ZWYifX19",
},
"Bread": {
	"name": "Bread",	"id": "a75e3f60-2242-4429-8ece-bcde77",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjM0ODdkNDU3ZjkwNjJkNzg3YTNlNmNlMWM0NjY0YmY3NDAyZWM2N2RkMTExMjU2ZjE5YjM4Y2U0ZjY3MCJ9fX0=",
},
"Cheese": {
	"name": "Cheese",	"id": "9c919b83-f3fe-456f-a824-7d1d08",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTU1ZDYxMWE4NzhlODIxMjMxNzQ5YjI5NjU3MDhjYWQ5NDI2NTA2NzJkYjA5ZTI2ODQ3YTg4ZTJmYWMyOTQ2In19fQ==",
},
"Strawberry_Jam": {
	"name": "Strawberry_Jam",	"id": "adc3ea73-5b42-4fea-a237-4a72b5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzBiOGI1ODg5ZWUxYzYzODhkYzZjMmM1ZGJkNzBiNjk4NGFlZmU1NDMxOWEwOTVlNjRkYjc2MzgwOTdiODIxIn19fQ==",
},
"Pancakes": {
	"name": "Pancakes",	"id": "78f0c232-7d83-4987-9e34-e15f42",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzQ3ZjRmNWE3NGM2NjkxMjgwY2Q4MGU3MTQ4YjQ5YjJjZTE3ZGNmNjRmZDU1MzY4NjI3ZjVkOTJhOTc2YTZhOCJ9fX0=",
},
"Cake": {
	"name": "Cake",	"id": "534c47c4-d04d-416a-bf99-c3efd6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjkxMzY1MTRmMzQyZTdjNTIwOGExNDIyNTA2YTg2NjE1OGVmODRkMmIyNDkyMjAxMzllOGJmNjAzMmUxOTMifX19",
},
"Cake_2": {
	"name": "Cake_2",	"id": "89fda3a9-8fb2-49f6-b414-7a9a85",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDU2MWRlZDhkODM4NWI5MTNhMDkxYWVmNDc4M2ZjY2JmZDNkMzhlZGQ5MGIyZTg5YjcyM2I1YTU3NDM0YmY0In19fQ==",
},
"Can_of_Soup": {
	"name": "Can_of_Soup",	"id": "97d1ca03-8958-4dea-80fa-f4019e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmM5MWY5NTA3YjQ4YjZmNzE5NzE0ZmJhYmE3N2NmNjg1MzRhYTViNzI4MzcxYjExODY2ZDU1ZmY4MzNhN2YifX19",
},
"Cup_of_Milk": {
	"name": "Cup_of_Milk",	"id": "84d4a877-45bf-4461-8667-1c443b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDdhYjYyZmI3NzE4OTM1MjU0MWRkOTVhOGVlN2UzNjMxZjdjMTY1OGY0NjNmNjYxNjgwYzI4MzQ5M2Q4YSJ9fX0=",
},
"Chocolate_Muffin": {
	"name": "Chocolate_Muffin",	"id": "44b7a5ee-e804-4a9f-b163-837a21",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODM3OTRjNzM2ZmM3NmU0NTcwNjgzMDMyNWI5NTk2OTQ2NmQ4NmY4ZDdiMjhmY2U4ZWRiMmM3NWUyYWIyNWMifX19",
},
"Muffin": {
	"name": "Muffin",	"id": "a77b189f-c30a-4962-8647-5cecac",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzQzMjE2YjNhZDJmNDc1N2EyM2MzYTI0Y2RhZjhjZTg3YmM0MjFkNGI2ZThiYzJjZTY0MmFhNDgwM2U5OSJ9fX0=",
},
"Oreo_Sandwich": {
	"name": "Oreo_Sandwich",	"id": "37dd5612-efdb-4f4b-bb55-9040a4",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGZkNzFlMjBmYzUwYWJmMGRlMmVmN2RlY2ZjMDFjZTI3YWQ1MTk1NTc1OWUwNzJjZWFhYjk2MzU1ZjU5NGYwIn19fQ==",
},
"Cookie": {
	"name": "Cookie",	"id": "e0982397-09b4-4670-a6a1-db670f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjU5MmNmOWY0MmE1YThjOTk1OTY4NDkzZmRkMWIxMWUwYjY5YWFkNjQ3M2ZmNDUzODRhYmU1OGI3ZmM3YzcifX19",
},
"Candy_Cane": {
	"name": "Candy_Cane",	"id": "201bdf0f-79ec-444f-a5ec-1a855f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGNjM2Y3ODFjOTIzYTI4ODdmMTRjMWVlYTExMDUwMTY2OTY2ZjI2MDI1Nzg0MDFmMTQ1MWU2MDk3Yjk3OWRmIn19fQ==",
},
"Chocolatebar": {
	"name": "Chocolatebar",	"id": "eaa47b1d-cb57-48c8-af33-cf4fd9",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODE5Zjk0OGQxNzcxOGFkYWNlNWRkNmUwNTBjNTg2MjI5NjUzZmVmNjQ1ZDcxMTNhYjk0ZDE3YjYzOWNjNDY2In19fQ==",
},
"Chocolatebar_2": {
	"name": "Chocolatebar_2",	"id": "91f8d9e9-0514-4319-902f-f2662f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWVkNTUyNjBkY2NjOGRhNTkzMzhjNzVlNDFkNTQ0YTJlMWU3ZGJlZjMxYTY5ZmU0MmMwMWIzMjk4YmYyZCJ9fX0=",
},
"Sliced_Lemon_(Citrus_Fruit)": {
	"name": "Sliced_Lemon_(Citrus_Fruit)",	"id": "ac578009-286d-402a-9280-ccd9d8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWRmNDEwZmRmMjEyOTY0YTU2MDZjYTBhMWI0NzczMDkyMjc3NWNhN2Y5NzYzZTVhZWE5YTNhYjQ0OWI2ZWMifX19",
},
"Cherry": {
	"name": "Cherry",	"id": "18126264-dc5b-4e45-a281-f5a39f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDUyNTcwNzY5NmJjZDE1YTE3MzA1NmZhMzkyOTZlODBmZjQxMTY4YmIwYWRkNTUyZjQ1MjNlMjU1OGEzMTE5In19fQ==",
},
"Apple": {
	"name": "Apple",	"id": "6679814b-8e75-46e2-93de-3b1b90",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2JiMzExZjNiYTFjMDdjM2QxMTQ3Y2QyMTBkODFmZTExZmQ4YWU5ZTNkYjIxMmEwZmE3NDg5NDZjMzYzMyJ9fX0=",
},
"Melon": {
	"name": "Melon",	"id": "21186685-3336-4dbd-8dda-493bc7",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzNmZWQ1MTRjM2UyMzhjYTdhYzFjOTRiODk3ZmY2NzExYjFkYmU1MDE3NGFmYzIzNWM4ZjgwZDAyOSJ9fX0=",
},
"Melon_2": {
	"name": "Melon_2",	"id": "772222f8-6bfa-4e42-876d-bf7074",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvN2U5NmNlZGM4YjU2ODNiZWEwMTY3MzkzNmI2ZWE5NmZlOTQ4YTJiNmNiNDQ0ZGMyOWUxZmNmZjRkMmUyY2Y0In19fQ==",
},
"Melon_3": {
	"name": "Melon_3",	"id": "f092a8f6-ffe6-4d98-801a-b48716",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjQxNDEyYjhjNmZkNTdlNGUxNjIxNjZkZGZkNzRiMTQ4YTU5NmY5ZWIxZDE1OTNjMDQ2OTYzOGM4ZDcxNCJ9fX0=",
},
"Melon_4": {
	"name": "Melon_4",	"id": "983afea2-cf1b-4732-9726-c81e3f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjM5MDMwNjZjY2M0Njk1ZTExM2ZlZTMxNGM5NmE1NDRlYjkxOTYyMmVlZTdkYWExZDE5NjYzNzRmM2ZlODQ4In19fQ==",
},
"Carved_Pumpkin": {
	"name": "Carved_Pumpkin",	"id": "280194bd-bbfa-440e-b3e1-ca3870",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmVjNDE1ZDcwMmYzMjkyYTgyZjE0NzFjODc5NGNmNjMxMjJkNDQ5ZDI4YWI4ODZkNGRjNThmYWZkNjYifX19",
},
"Pumpkin": {
	"name": "Pumpkin",	"id": "9650240d-aa92-4ceb-9cfa-676f0c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDdkN2FkMmRjYjU3ZGZhOWYwMjNkYmI5OWI2OThmYzUzMDc1YzNlOWQ2NTQ1MDYxMzlhNjQ3YWM5MDdmZGRjNSJ9fX0=",
},
"Strawberry": {
	"name": "Strawberry",	"id": "1acb2610-4fc4-46b0-8dae-679ccb",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2JjODI2YWFhZmI4ZGJmNjc4ODFlNjg5NDQ0MTRmMTM5ODUwNjRhM2Y4ZjA0NGQ4ZWRmYjQ0NDNlNzZiYSJ9fX0=",
},
"Coconut": {
	"name": "Coconut",	"id": "4d09dc2c-ae45-4542-b667-c7770b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTliMGU5NjljZjNmY2NlZDM2YjcxMjM1MGZmYjQ2ZDhlZDc2MWZlNWVmYjEwZTNiNmE5Nzk1ZTY2NTZkYTk3In19fQ==",
},
"Carrot": {
	"name": "Carrot",	"id": "e06ae6f5-9b2c-49a4-9b91-daed1a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjE1OTk4ODQ0M2VlNzVkMjBjNDljODlhYmFkNTU0NWJiNGZiNDUzYTQyYjAzODhiNTQ2NjM1NTY5OGJmYSJ9fX0=",
},
"Sugarcane": {
	"name": "Sugarcane",	"id": "27469789-1229-45e5-bbef-e7bb29",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzNjYTlkOGIxZDVmMmMyNjU0NzY0NDAzNGE1NWE0YTI0NjNlMTY2ZjYwZmViMGM3YzVhZjNmNzI0YmFlIn19fQ==",
},
"Hot_Chocolate": {
	"name": "Hot_Chocolate",	"id": "3c534489-c08b-4c4f-a5ec-9bd993",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDExNTExYmRkNTViY2I4MjgwM2M4MDM5ZjFjMTU1ZmQ0MzA2MjYzNmUyM2Q0ZDQ2YzRkNzYxYzA0ZDIyYzIifX19",
},
"Cup_of_Tea": {
	"name": "Cup_of_Tea",	"id": "2a3545d4-3ea5-4d26-9033-c28047",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDhlOTRkZGQ3NjlhNWJlYTc0ODM3NmI0ZWM3MzgzZmQzNmQyNjc4OTRkN2MzYmVlMDExZThlNGY1ZmNkNyJ9fX0=",
},
"Taco": {
	"name": "Taco",	"id": "36784eab-0695-455b-9b45-949437",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOThjZWQ3NGEyMjAyMWE1MzVmNmJjZTIxYzhjNjMyYjI3M2RjMmQ5NTUyYjcxYTM4ZDU3MjY5YjM1MzhjZiJ9fX0=",
},
"Taco_2": {
	"name": "Taco_2",	"id": "46bbd502-1ef0-4fe8-a033-9a5687",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWExZjM1ODVmNTQ4NDliNDFkYTVkMzI2YTk0Mzk1NmEyNTQ5NDM2NGJiOTYxZDI0NThjNDMwYmU5YTZiMjcifX19",
},
"Baked_Potatoe": {
	"name": "Baked_Potatoe",	"id": "0e8a0f94-2a9d-4ec1-8700-a81487",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmYzMTJhMjQzYWE0ZTY5YTVlZGM2N2U1NGU0NGY3NmViODRmNjZlYzgyNDA4OTU1N2E2NGJlYTcxZjZkYyJ9fX0=",
},
"Bacon": {
	"name": "Bacon",	"id": "a0b0d539-9b6a-4233-8795-39e304",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTdiYTIyZDVkZjIxZTgyMWE2ZGU0YjhjOWQzNzNhM2FhMTg3ZDhhZTc0ZjI4OGE4MmQyYjYxZjI3MmU1In19fQ==",
},
"Fries": {
	"name": "Fries",	"id": "426d69dc-855e-4531-8778-9f5711",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTBlYWNhYzQxYTllYWYwNTEzNzZlZjJmOTU5NzAxZTFiYmUxYmY0YWE2NzE1YWRjMzRiNmRjMjlhMTNlYTkifX19",
},
"Hamburger": {
	"name": "Hamburger",	"id": "bb7dc51c-1dce-42f4-ae93-6a7907",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTZlZjFjMjVmNTE2ZjJlN2Q2Zjc2Njc0MjBlMzNhZGNmM2NkZjkzOGNiMzdmOWE0MWE4YjM1ODY5ZjU2OWIifX19",
},
"Hamburger_2": {
	"name": "Hamburger_2",	"id": "344d2378-914d-4ca3-9839-5ae184",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjBlMzhjMTc2ZGJmN2RmOWIwNjMyYzI1NmVlYjZjNWFhY2E5OWUxYzhjMWE1MzA2NTZlYWZmMDQxN2FlZDIyIn19fQ==",
},
"Hamburger_3": {
	"name": "Hamburger_3",	"id": "cd02b2ac-24de-4da3-b66d-8405fa",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2RhZGYxNzQ0NDMzZTFjNzlkMWQ1OWQyNzc3ZDkzOWRlMTU5YTI0Y2Y1N2U4YTYxYzgyYmM0ZmUzNzc3NTUzYyJ9fX0=",
},
"Popcorn": {
	"name": "Popcorn",	"id": "11ad1a4f-ddba-4550-abd7-14288f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTQ5N2IxNDdjZmFlNTIyMDU1OTdmNzJlM2M0ZWY1MjUxMmU5Njc3MDIwZTRiNGZhNzUxMmMzYzZhY2RkOGMxIn19fQ==",
},
"Glass_of_Coca-Cola": {
	"name": "Glass_of_Coca-Cola",	"id": "296a6aa6-ef9b-467b-ae3e-31b817",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTliNDFlOWZlNTQzZjIzNzVkMGE5N2RkNTkyMmU0ZDY1YjhhNTIzYmFmMjI2NWQ0MjM5OGQ2NGMzNjRlZjk1In19fQ==",
},
"Sushi_Mackerel": {
	"name": "Sushi_Mackerel",	"id": "216f5683-3506-4098-a741-18780b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODQ2ZDMxNzJlN2Q2YWQ2ZGY2YTIxODk3NTVjZTBiMmRjODVhMWY5Y2NkMTA5ZGM5MzI5ODU4NjdiYTYifX19",
},
"Sushi_Salmon": {
	"name": "Sushi_Salmon",	"id": "bc8ee27d-b320-47b9-aa5e-b473ad",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjNiZjhmY2EyYWYzNTkyYzU1NzRiMTNlM2JjZjYxZTJmYWU4Mjk3ODg1MzVmMGRkZWFhN2EyZTQ1YjZiYTQifX19",
},
"Sushi_Roll": {
	"name": "Sushi_Roll",	"id": "d2e5a02a-a89f-41fc-a0e6-c340ec",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmUxMmYyNjc5NTNlNzZhZTY2YThkZDAyNWEzMjg2YWVjYmM2NGI0YWQ5OGVlYjEwYjNjNjdhNjlhYWUxNSJ9fX0=",
},
"Riceball": {
	"name": "Riceball",	"id": "435bb3d4-6a23-4161-8300-007b3f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjljMmRkZjJiZDc0YTQ2NTVlOGYwMTUzYTc0NTNlNjdkYjJhMjFkYmZhYzY3NTY3ODk0ODFhZGJlYzQ4M2EifX19",
},
"Corn_Block": {
	"name": "Corn_Block",	"id": "06c04136-d712-4a98-bab4-76c353",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTlkZmFjMTcxZTNjMjAyOTY3NmVjZjhkM2EwZmQ5YjdiYjI4NTdiOTVlZmRlZmM1OWUwZjI1MjU3NmI1YzY4In19fQ==",
},
"Ham_Cheese_Sandwich": {
	"name": "Ham_Cheese_Sandwich",	"id": "217e186d-acfe-4d17-905d-1d4d20",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmFlZTg0ZDE5Yzg1YWZmNzk2Yzg4YWJkYTIxZWM0YzkyYzY1NWUyZDY3YjcyZTVlNzdiNWFhNWU5OWVkIn19fQ==",
},
"Glass_of_Beer": {
	"name": "Glass_of_Beer",	"id": "e3e6b7a8-4246-41c4-9663-eddc9e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDA1M2UyNjg2N2JiNTc1MzhlOTc4OTEzN2RiYmI1Mzc3NGUxOGVkYTZmZWY1MWNiMmVkZjQyNmIzNzI2NCJ9fX0=",
},
"Medieval_Beer": {
	"name": "Medieval_Beer",	"id": "0be2d451-8ae5-4250-a0f1-74f448",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjI5NjAzZDgyOTYzMDU2YmUxMzUyMmNmYjdkNDUyMGM3NmJhNjg3ZjM5NmEwZGFiMTI1ZTYzYjVkYWNlYTgifX19",
},
"Clock": {
	"name": "Clock",	"id": "f952235c-44a2-4f91-a6aa-0fcf36",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmRlNGUyNzgzZjg1YTM5MTIyMWRkOTE2NTZiYTY4OGU3ZTQyZDE2ZjZhYmJmYmNmYWQ5Y2E1MzYxN2ZjYTYifX19",
},
"Golden_Clock": {
	"name": "Golden_Clock",	"id": "c0479b63-4eb6-4f07-a685-34e5df",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmZlOGNmZjc1ZjdkNDMzMjYwYWYxZWNiMmY3NzNiNGJjMzgxZDk1MWRlNGUyZWI2NjE0MjM3NzlhNTkwZTcyYiJ9fX0=",
},
"Antique_Clock": {
	"name": "Antique_Clock",	"id": "4d005eae-aa4e-4f0f-abe8-b53151",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzg0NzJhMmRjYzIzOWI0YTQ4M2FjNDRjMWRiZjhmZGJhMGZjYTFkMjUzZWI2NDNmYTBiZDkzYWY4M2EzNzMifX19",
},
"Gamecube": {
	"name": "Gamecube",	"id": "995baa38-4956-405d-b025-6676d2",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2MxZTJiODJkYjEwYWQyNWNhNDEzNDVlOTI0NWY1ODQ3ZTc2NzYwY2QyNDVjNDhlNWFmMWZkODk4NWVmOTE1In19fQ==",
},
"Gamecube_2": {
	"name": "Gamecube_2",	"id": "ce4eab67-3e7c-4559-bcdf-f0811f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTA2M2EwZWJiMmQ4MDEwMjczYjZjNDViNjRlODRkODNiMWU0M2UyY2E1ZGZiMmE2ZmQ4MzhjM2Y4ODgyN2QifX19",
},
"Security_Camera": {
	"name": "Security_Camera",	"id": "c4a226e0-067b-4b6d-96b9-0f07f4",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmYxNTlhMWNiZTE3M2Q5MjczOTJmYTY1ZmNmZTc4NTUzZDgxYWE1ZGMyOTQ5NWI5ZmJiYWRlMzYyZjhiZjkifX19",
},
"Camera": {
	"name": "Camera",	"id": "b9161c71-513a-46f2-a046-20ecfa",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWE3ZDJhN2ZiYjRkMzdiNGQ1M2ZlODc3NTcxMjhlNWVmNjZlYzIzZDdmZjRmZTk5NDQ1NDZkYmM4Y2U3NzcifX19",
},
"Speaker": {
	"name": "Speaker",	"id": "2ba86606-242e-4774-971f-cadf3a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmY3YmVjZjE3MThlOWE2MDk2ZWU1ZjljYjdhYmViNmNmZDk0ODhjNDRhMzExNjQwN2M5MmVjMzNhZDdkODUyMSJ9fX0=",
},
"Headlight": {
	"name": "Headlight",	"id": "5b1ee371-f921-4eff-a638-96e2cb",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTllOWM5MjQ2ZjFiYTVhNDFlNTNlZmE2OGIyYmQ1NmE3MGRhMzA4ZjM5MzQ4N2RjZjZmZTc1Njc5OWIzYzcifX19",
},
"Ceiling_Lamp": {
	"name": "Ceiling_Lamp",	"id": "1451ea35-8afe-469b-acb5-0b8ffd",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjA4OTYzOTBjNDkyMWJmODg5YTI5Y2ZkMTg0MmFiZjllZjdmODRlNWEyMmZiY2U3ZTY0ODkxZGI0MTY2NmJjIn19fQ==",
},
"Microwave": {
	"name": "Microwave",	"id": "1d049d2d-2737-4969-b9bd-301062",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTc2ZmE2MzZjNTRlMzYwODVmZTJmYTQ2ZGM5NjYyMTVjMTU3MjJiYjc2NGEyZWVlODRjZmU4NDc2Y2FmNzEifX19",
},
"Computer": {
	"name": "Computer",	"id": "81c080fd-022b-477c-9f24-f63732",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGFlNTJhZThjOThhYzE5ZmQwNzYzN2E0NjlmZmEyNTZhYjBiM2IxMGVjZTYyNDMxODYxODhiYTM4ZGYxNTQifX19",
},
"Computer_2": {
	"name": "Computer_2",	"id": "6078a2eb-756d-49d1-87d3-b9e782",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWM5YTkxYTc0ZDNhMWJiMWQ3ODVmNWJkYzhkODI2ZGUzYjJmZGRjNmExZmFkMTI5MjNmZDA2ZWM4NGY0OTllIn19fQ==",
},
"Monitor": {
	"name": "Monitor",	"id": "df045cc0-7ec9-4cbc-8219-2ea32e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWQxZTk5NzkyODlmMDMwOTlhN2M1ODdkNTJkNDg4ZTI2ZTdiYjE3YWI1OTRiNjlmOTI0MzhkNzdlYWJjIn19fQ==",
},
"Monitor_2": {
	"name": "Monitor_2",	"id": "6522a7fd-3649-4d2c-a6b4-3c24e5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTVjMjkyYTI0ZjU0YTdhNDM3ODUyNjY1NTJkYmE3YTE4NGY5YzUwZTBkOTRiMzM3ZDhkM2U3NmU5ZTljY2U3In19fQ==",
},
"Old_Radio": {
	"name": "Old_Radio",	"id": "bddea199-e7e3-4c7b-a3fb-64f40c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGMzYzg1MTc1MTZmOGQ4ZTgwNjc3ODFlN2M2MmVlYTI3ZGU0NzhiMTRjNGE2OGM4ZThjMWFkOGFmMWJhZTIxIn19fQ==",
},
"Computer_3": {
	"name": "Computer_3",	"id": "5a929f7f-1a74-4d25-860d-40ff53",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTg2ZjcyYzE2YjFlOWZlNmUwOTllNzZiNWY3YTg4NGZiNzgyY2ZjYzU4OGM5NWM0ZTM4M2RjNTI3ZDFiODQifX19",
},
"Monitor_3": {
	"name": "Monitor_3",	"id": "7a6da744-735f-45fd-a1af-1895da",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmQ2YzY1YjQ0YzM0YjFhY2MyY2NiMzQ2NzUyMzk3MTI1ZjBkOWZmYTBhYjNjNTBhOTlkMWRiM2I3NGM2MyJ9fX0=",
},
"Toaster": {
	"name": "Toaster",	"id": "eed7f9fd-3174-45a3-83dc-cff99e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmI1M2U4ZDM3NGI0ZjZmNTczZDEyODY2ODFiZjg0MTA1NWI4OWE0NjJmN2NkZDk5ZThlNjNkMmY1MTRlNDUifX19",
},
"Toaster_2": {
	"name": "Toaster_2",	"id": "5654427c-b4b2-4a0c-a963-93ac28",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTQzZmU4ODAyZWRiMmU5ODFhZTZlZDRkZmFiYTNlYWI3OWFhOGZhY2Y5YWJkYzM4MTI2ODk2ZGViZWI3YzZiIn19fQ==",
},
"Camera_2": {
	"name": "Camera_2",	"id": "6a25739e-94c9-4c94-8f8b-20f666",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjA3YmQzOGYxNmIzODBjODgyZjhjMjgzMTVlYmVkMjU2MWFkYWIyZmRiOTk2YjJjYzBkNzQ3ZjY0YmM0ZWI4In19fQ==",
},
"Telephone": {
	"name": "Telephone",	"id": "a15f8f85-3f97-4c4e-a61d-43b5ad",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODI0NDJiYmY3MTcxYjVjYWZjYTIxN2M5YmE0NGNlMjc2NDcyMjVkZjc2Y2RhOTY4OWQ2MWE5ZjFjMGE1ZjE3NiJ9fX0=",
},
"Old_Camera": {
	"name": "Old_Camera",	"id": "59b0471f-ba49-4976-acd5-44e8b9",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDNhMGZlYjYyNmU1NjdlNDc5NTc2ZjRmZjU0M2UxNmU5YjM2YTczMDQ4OTFiMmYzMjkzZWFhOGI2ODczNWE0In19fQ==",
},
"Lantern": {
	"name": "Lantern",	"id": "8c0662db-972a-4039-a360-3dc1a9",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvN2NjMjE3YTliOWUzY2UzY2QwNDg0YzdlOGNlNDlkMWNmNzQxMjgxYmRkYTVhNGQ2Y2I4MjFmMzc4NzUyNzE4In19fQ==",
},
"Lantern-off": {
	"name": "Lantern-off",	"id": "b74968df-8511-4dec-b5d7-58f31e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDJjODFiNDM1ZGMyMmQyOWQ0Nzc4ZmZkMjJmZWI4NDZhNjhiNjQ4ZGQxYWY1ZGU4MThiNTE3ZjA1NzRkIn19fQ==",
},
"Showerhead": {
	"name": "Showerhead",	"id": "db3d2f45-58f2-43aa-bc4d-e23be9",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWM2ODRjZjFiYjk0NTNkOWUyZjNlZDJiMmNiYzdkMzQzZDhjMzI3M2QxMWRmZWRjZTM2NzllOWU1MzRhNGJlIn19fQ==",
},
"Aquarium": {
	"name": "Aquarium",	"id": "89abda82-5116-4a40-88c1-c98602",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzI4NDdjZDU3MTdlNWY1YTY0ZTFiYTljYjQ4MWRjOWUyMmM3OGNhMjNmODUxNmQ1NTNmNTU0MTJmYTExM2UwIn19fQ==",
},
"Instagram": {
	"name": "Instagram",	"id": "5e469ecf-80a4-40ae-8d9d-7c12bd",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjViM2YyY2ZhMDczOWM0ZTgyODMxNmYzOWY5MGIwNWJjMWY0ZWQyN2IxZTM1ODg4NTExZjU1OGQ0Njc1In19fQ==",
},
"Siren": {
	"name": "Siren",	"id": "5ae828fd-f472-4f9d-bc23-5f58ce",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTZiMjIxYmU4OTY3OGQ1ODU2ZWFhNjg2NjdmOTg2ODMxNzViY2NlNjc0MWY4MmM2MmU3M2YwNDQxNjYzNjcifX19",
},
"Police_Siren": {
	"name": "Police_Siren",	"id": "5e1f20a6-f3db-4de0-afe9-758a30",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDRiZjY0M2NmYjQxZWU1ZjllNjE4ZGU5Nzg5Y2M2ZDg1YzJlOTUzZjQ0NTY3ZTRlMmQzYjE5YTc5ZTg0MyJ9fX0=",
},
"Computer_4": {
	"name": "Computer_4",	"id": "3df1246e-bf36-46c7-b677-f7bafc",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGQxOWM2ODQ2MTY2NmFhY2Q3NjI4ZTM0YTFlMmFkMzlmZTRmMmJkZTMyZTIzMTk2M2VmM2IzNTUzMyJ9fX0=",
},
"Broken_TV": {
	"name": "Broken_TV",	"id": "843c0514-838e-4e87-9fd8-4206e9",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTI0N2M4NzY0ODgxNjdjNzRjYjk0OGFiMTE4MWU2YmVmOWU0YzhkNzU3M2MxOTFhYWFiNGU1Y2M3NWIwOWQifX19",
},
"Broken_TV_2": {
	"name": "Broken_TV_2",	"id": "2f527600-828b-4262-a084-b637c8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjAxN2JjNDhmZTNjZGM5MDg1YTBlMTEwZmUxZjYyODQyNmEwOTc3NTc0NzM5OGRlNTcyNGU3MzU4NmJkIn19fQ==",
},
"Broken_TV_3": {
	"name": "Broken_TV_3",	"id": "cca3abf8-4db0-4451-946e-c38f78",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2M5OWQ4ZmJhZDExZjliNzMzNDBiY2MxYWRmNmRkMjhmNjdmNzU0YjUyY2U0ZTUwMmI0ZmUwMmIxNmIxODM0In19fQ==",
},
"Broken_TV_4": {
	"name": "Broken_TV_4",	"id": "6ed9034b-059d-416b-8b4c-dac559",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDVlOWJkNDI1ZmJkMzlhOTRjMzBiZjVhZWIzMDFkYjE4NjcxMzMyMjc2MWZjODJhNzZmYjYxNjg3OTM0OTAifX19",
},
"Broken_TV_5": {
	"name": "Broken_TV_5",	"id": "87060e26-3d69-4bee-a46d-76df25",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmUzZGIyN2NiZDE3ODkzMTA0MDkwODFhZDhjNDJkNjkwYjA4OTYxYjU1Y2FkZDQ1YjQyZDQ2YmNhMjhiOCJ9fX0=",
},
"Beachball": {
	"name": "Beachball",	"id": "1efa4ef0-cc47-4aa3-bbcb-8eb10f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWE1YWIwNWVhMjU0YzMyZTNjNDhmM2ZkY2Y5ZmQ5ZDc3ZDNjYmEwNGU2YjVlYzJlNjhiM2NiZGNmYWMzZmQifX19",
},
"Soccerball": {
	"name": "Soccerball",	"id": "b74e58ec-4460-44b9-b0ca-2a1b9f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGU0YTcwYjdiYmNkN2E4YzMyMmQ1MjI1MjA0OTFhMjdlYTZiODNkNjBlY2Y5NjFkMmI0ZWZiYmY5ZjYwNWQifX19",
},
"Toiletpaper": {
	"name": "Toiletpaper",	"id": "5b6db080-2866-4aed-9ec0-f80e60",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzM4MGM3ZTYyMWExZjRkYTU0M2U0YzdhYjE0OTRlZTE4NGI4N2JiMTMyNDE4NTEyYzllZWU4NThmOWRlMWRiIn19fQ==",
},
"Toiletroll": {
	"name": "Toiletroll",	"id": "91325869-cc5e-4329-bede-ce2324",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjk4MDhiOWEzMWEzOTYxMWQ1N2FjN2NkNDc3ZjMwODc2NTFkNzkyM2FlZTViODhjNjUyZmI1YmY3NzU5YmJiIn19fQ==",
},
"Gold_Pot": {
	"name": "Gold_Pot",	"id": "336cacb9-2ac6-4e42-84ac-77f8ab",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWE5NzZmNmRmY2YxODg5OTVhMzI3ZTU1Y2UzNGM2MGU2ZGNkMWZmNjNlNjhkZDFmYzNhZDc1ZDJkMWJmIn19fQ==",
},
"WinRAR_Books": {
	"name": "WinRAR_Books",	"id": "d53ab3c2-6e27-47eb-8e6e-7fe716",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGQxYjI4Zjg4NmNhM2M4ZmM0MzAxYjc4NWJmMzhjNjE5ZWE2NmI2ODM1MmE4ODJiZjgwODBlNjMwMzRlMCJ9fX0=",
},
"Bookcase": {
	"name": "Bookcase",	"id": "bce675c3-8200-4e31-b20b-6d53e7",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzJhMThkMzZjNzQ2ZTQ4NDM4NTBhM2I2NWM1MTE1MGFiM2Y3NWQxM2I3ZjhjYzU1Yzc2ODZmZWJkMTdiNmEifX19",
},
"Bookshelf": {
	"name": "Bookshelf",	"id": "2ac53708-426b-4d05-9add-e98d13",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTMxODRkNmFkNGEwZTE1YjNhNzFkYWRmNDVmNmM3Y2U5ZWM5NjE3MmJjOWZmMjVmZDNhZjc4N2EzNzliZDEifX19",
},
"Pile_of_Books": {
	"name": "Pile_of_Books",	"id": "6e166933-a807-4a73-8a19-e44053",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjFjNjNkOWI5ZmQ4NzQyZWFlYjA0YzY5MjE3MmNiOWRhNDM3ODE2OThhNTc1Y2RhYmUxYzA0ZGYxMmMzZiJ9fX0=",
},
"Bowlingball": {
	"name": "Bowlingball",	"id": "8704138c-bb3e-446f-bb6a-b73343",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmM4MmUyMWE5MzIwOTUzZDc4ZGFlZTg1NDc3ZGUzYmI4MmQ1ZGZhNmIxOTQ5NGQzNzczMzI2NWQyZDAzMGE4In19fQ==",
},
"Bowlingball_2": {
	"name": "Bowlingball_2",	"id": "cb819908-ccf7-4e71-b861-0d7296",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWNjODYxYzUyNDg2YmZjMTlkMjhiZTA2NDRhODViNGM3MTJiZjcxYzdiMjYzNjVhZTFiNTRiOWE3MTczY2QwIn19fQ==",
},
"Bowlingball_3": {
	"name": "Bowlingball_3",	"id": "e25bd6ef-8c67-497b-be71-48923b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzQ0NTVkMThiYzJhNmI1YTgzYjY5YTcyOTA0MDYxOTRmZDE1MmM4OWQ5NjE5YzA4ZmQ4ODc2M2YxMzYifX19",
},
"Lava_Bucket": {
	"name": "Lava_Bucket",	"id": "511af44d-67f6-44e7-a3c2-64d844",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGQ1NDI3YTgzNTQwYTA4YTNmYTJlNjU1YzI5NjRhMDcyNDM1MTQ1ODRhNzFlYzM1ZDZiOWUxODRkZmJlMzE4In19fQ==",
},
"Milk_Bucket": {
	"name": "Milk_Bucket",	"id": "5bd86036-06c1-48a4-846b-1ea6ea",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjU4Yzk3NTY2MWMzZTk0ZmMzNTExNTY0ODE1OGUzZWU5ZjgwZGY3NGE0Mzk5ZTRkMzFjYTVkYmJjYWYyOWI2In19fQ==",
},
"Empty_Bucket": {
	"name": "Empty_Bucket",	"id": "f7210576-cd02-4b4d-9448-8093bb",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjFlYTgyNTE1MGIwNmU2NWUyY2ViNTkzYWZlMzQyZGNhNTZkZGExMmJmNmM5Njk2ZmI4MmY5MGRjZDQyM2FiIn19fQ==",
},
"Water_Bucket": {
	"name": "Water_Bucket",	"id": "8306a6f1-bb5f-45d2-b59d-ac9531",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDlmMWYwN2UyYjFjMzJiYjY0YTEyOGU1MjlmM2FmMWU1Mjg2ZTUxODU0NGVkZjhjYmFhNmM0MDY1YjQ3NmIifX19",
},
"Chest": {
	"name": "Chest",	"id": "148ce164-81e8-43d3-b057-4b21cf",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmY2OGQ1MDliNWQxNjY5Yjk3MWRkMWQ0ZGYyZTQ3ZTE5YmNiMWIzM2JmMWE3ZmYxZGRhMjliZmM2ZjllYmYifX19",
},
"Enderchest": {
	"name": "Enderchest",	"id": "42db67b6-9dd1-4bfe-b478-8829c1",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTZjYzQ4NmMyYmUxY2I5ZGZjYjJlNTNkZDlhM2U5YTg4M2JmYWRiMjdjYjk1NmYxODk2ZDYwMmI0MDY3In19fQ==",
},
"Iron_Chest": {
	"name": "Iron_Chest",	"id": "90ff743f-323c-49e0-a239-aaa211",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZThlNTU0NGFmN2Y1NDg5Y2MyNzQ5MWNhNjhmYTkyMzg0YjhlYTVjZjIwYjVjODE5OGFkYjdiZmQxMmJjMmJjMiJ9fX0=",
},
"Medicine_Chest": {
	"name": "Medicine_Chest",	"id": "f32f4e87-9fb0-48b0-8cc4-56eebf",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjdjN2RmNTJiNWU1MGJhZGI2MWZlZDcyMTJkOTc5ZTYzZmU5NGYxYmRlMDJiMjk2OGM2YjE1NmE3NzAxMjZjIn19fQ==",
},
"Mailbox": {
	"name": "Mailbox",	"id": "d6f26320-f6ba-449b-941e-a40ea4",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzBkMjI3YjMzMjY1OTZjYjkyZTY4MWE0NDVkYzk5ZDRjNjk2NWYxMWE4MDg2YWVlNjJkZGYwOWI3NzViIn19fQ==",
},
"Cabinet": {
	"name": "Cabinet",	"id": "babc218e-63dc-4ba7-b452-3c271e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTMzZWNiNTU4ZjIxYzkxODk3Nzk4N2U5NzRmMmU2YmQxMjhlYjlkOWMwNTQxNGU5NDZkZDc4NmViZGI0In19fQ==",
},
"Checkerboard": {
	"name": "Checkerboard",	"id": "2731d11b-11df-43fd-b428-e81654",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjg3MGE2NTk5MmMyZGQ4YWQ3MzhiOThkNmQzNTk2ZTQ1YTJkZDE0ZWZiYWNlNGIyMTEyMmFlYWZmNzc3ZjUifX19",
},
"Space_Helmet": {
	"name": "Space_Helmet",	"id": "fc6f2ea4-543e-477f-98db-02c0f5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2U4YWFkNjczMTU3YzkyMzE3YTg4YjFmODZmNTI3MWYxY2Q3Mzk3ZDdmYzhlYzMyODFmNzMzZjc1MTYzNCJ9fX0=",
},
"Space_Helmet_2": {
	"name": "Space_Helmet_2",	"id": "822833e6-c3ec-457e-aeef-1fac97",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzAyZTIyZjY1MDNjMzYzZGY2OWJmOWU5NDQ4ZmU4OWQyZjA1YmFlMzA1MzRiOGJiMTlkMjY4ZjA5ODliOTYifX19",
},
"Football_Helmet": {
	"name": "Football_Helmet",	"id": "fe7d85f9-8961-4208-95ad-339d87",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGQ3YjYyYWNhMjg0NDViOGUxMWVhMTc1MGVlYWNkOTc5MzJmYTM3YmE3NDQ3Njg1NzNlOGRjNThhNmFmMSJ9fX0=",
},
"Eye": {
	"name": "Eye",	"id": "f9f975e2-cdf7-411b-9323-f5db99",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmNlZjg3NzcyYWZkODViNDY4ZjRjN2ZiOTU3MWUzMTQzNWVmNzY1YWQ0MTNmZTQ2MDI2MjE1MDQyM2UyMDIxIn19fQ==",
},
"Present": {
	"name": "Present",	"id": "cc5fdd1a-60f8-40d6-b667-a197e3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjBhZmE0ZmZmZDEwODYzZTc2YzY5OGRhMmM5YzllNzk5YmNmOWFiOWFhMzdkODMxMjg4MTczNDIyNWQzY2EifX19",
},
"Present_2": {
	"name": "Present_2",	"id": "990d87d1-27ad-4b30-80c4-689394",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTNjZmJmMmJkZmQ0ODUxNGJmYmFjZTk1MThjNzY2NDExMmRmMmMxNzNlOGM3YWQ5MmIzZTY1NjIxYTllZDZlMCJ9fX0=",
},
"Present_3": {
	"name": "Present_3",	"id": "6f3e1f19-8b42-44cb-a25c-cc841e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzZlNjliMWM3ZTY5YmNkNDllZDk3NGY1YWMzNmVhMjc1ZWZhYmI4YzY0OWNiMmIxZmU5ZDZlYTYxNjZlYzMifX19",
},
"Poke_Ball": {
	"name": "Poke_Ball",	"id": "04be8421-c832-4cf8-82e5-9b88d8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDQzZDRiN2FjMjRhMWQ2NTBkZGY3M2JkMTQwZjQ5ZmMxMmQyNzM2ZmMxNGE4ZGMyNWMwZjNmMjlkODVmOGYifX19",
},
"Red_Mushroom": {
	"name": "Red_Mushroom",	"id": "adb9a7ec-10d9-406f-85bd-69207e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzMyZGJkNjYxMmU5ZDNmNDI5NDdiNWNhODc4NWJmYjMzNDI1OGYzY2ViODNhZDY5YTVjZGVlYmVhNGNkNjUifX19",
},
"Pine_Cone": {
	"name": "Pine_Cone",	"id": "563d652a-7792-4db6-8005-0e7097",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTk4OGVjNjVjNTFhODU3NzJjOGQ4NmQ3NGVhOGUwZTU3MjUyM2JmOGVkYzhjYmE1YWQxMTk1MmZiZWJlNjYwIn19fQ==",
},
"Cannonball": {
	"name": "Cannonball",	"id": "d9dc3de0-66f8-4156-888c-ee63da",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjI1MjNlMTVlOTk4NjM1NWExZjg1MWY0M2Y3NTBlZTNmMjNjODlhZTEyMzYzMWRhMjQxZjg3MmJhN2E3ODEifX19",
},
"Cannonball_2": {
	"name": "Cannonball_2",	"id": "4dc013ea-3132-4271-a54a-ebc1f5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTk2NzU0ZDMzMDQzNTM0NWFhZTNhOWYwNjNjZmNhNDJhZmIyOGI3YzVjNGJiOWYyOTRlZDI1MjdkOTYxIn19fQ==",
},
"Glados": {
	"name": "Glados",	"id": "529b5f57-d4ac-48ad-b900-71903d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTViZWM3NmQ2NWE4NjhhNWJlNTE3M2QzYjllMTc3NWI1NDA0NmY2MjAzNWMxNTUyNDQwZWRlOTk3M2E5MGUxIn19fQ==",
},
"Turret": {
	"name": "Turret",	"id": "fda4e8a0-4f40-4bd9-adbe-b05cce",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmEyYzNlNzlkNWYzNWE5ZGNhYjE5ZTQzYzNlM2E2NTE5ZTQyNmI2NGE2MTIxM2NkMmYxZDI4YjU3MDM2ZjYifX19",
},
"Companion_Cube": {
	"name": "Companion_Cube",	"id": "5969ee2f-b5b1-4e03-b846-820dbd",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTE3NWJkZjQ3YWVhMWE0YmYxZDM0OWJlNmI3ZmE0YWIzN2Y0Nzk2NzJmNGM0M2FjYTU3NTExYjQyN2FiNCJ9fX0=",
},
"Weighted_Cube": {
	"name": "Weighted_Cube",	"id": "dbb0c105-4693-4a6d-8a7c-ac8fea",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTJiYWViNGEzNWRhOGE4NWQxNGJkY2NmNzE4NGY1NTQ1MDg4Zjk1NGRhNTUxNDRmMjM1YzI5ODNmZGI4ZTA1YiJ9fX0=",
},
"Target": {
	"name": "Target",	"id": "d8589165-a9d7-4215-924d-d43395",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODZmY2FlZmExOTY2OWQ4YmUwMmNmNWJhOWE3ZjJjZjZkMjdlNjM2NDEwNDk2ZmZjZmE2MmIwM2RjZWI5ZDM3OCJ9fX0=",
},
"Globe": {
	"name": "Globe",	"id": "10174993-9b01-4045-919c-bf82db",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjFkZDRmZTRhNDI5YWJkNjY1ZGZkYjNlMjEzMjFkNmVmYTZhNmI1ZTdiOTU2ZGI5YzVkNTljOWVmYWIyNSJ9fX0=",
},
"Cactus": {
	"name": "Cactus",	"id": "8637acbc-b72f-4155-8115-7decc1",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzhjOWE3MzAyNjljZTFkZTNlOWZhMDY0YWZiMzcwY2JjZDA3NjZkNzI5ZjNlMjllNGYzMjBhNDMzYjA5OGI1In19fQ==",
},
"Facebook": {
	"name": "Facebook",	"id": "4ac1c429-e329-4861-b1d6-c4bde5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGViNDYxMjY5MDQ0NjNmMDdlY2ZjOTcyYWFhMzczNzNhMjIzNTliNWJhMjcxODIxYjY4OWNkNTM2N2Y3NTc2MiJ9fX0=",
},
"Twitter": {
	"name": "Twitter",	"id": "45eeb2cc-e4ef-4012-beae-c3bc6c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzY4NWEwYmU3NDNlOTA2N2RlOTVjZDhjNmQxYmEyMWFiMjFkMzczNzFiM2Q1OTcyMTFiYjc1ZTQzMjc5In19fQ==",
},
"Youtube": {
	"name": "Youtube",	"id": "4ec6d571-4553-4a75-a4ae-6e104b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjQzNTNmZDBmODYzMTQzNTM4NzY1ODYwNzViOWJkZjBjNDg0YWFiMDMzMWI4NzJkZjExYmQ1NjRmY2IwMjllZCJ9fX0=",
},
"Plant": {
	"name": "Plant",	"id": "e303e867-1764-4350-bcbf-da4ecd",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmY5YzcxYWYzZjdlODE5ZWMzYzQ0OTZmMjkxNTY3YWVmYjk4ZjU1ODQ1MTdkYTI2NmJhMGE2ZWNjYWE5YTZlMyJ9fX0=",
},
"Firecharge": {
	"name": "Firecharge",	"id": "2a0c6eae-1ad9-4675-bde7-4bc860",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWMyZTlkODM5NWNhY2Q5OTIyODY5YzE1MzczY2Y3Y2IxNmRhMGE1Y2U1ZjNjNjMyYjE5Y2ViMzkyOWM5YTExIn19fQ==",
},
"Portable_Grill": {
	"name": "Portable_Grill",	"id": "756a71b1-6473-4b0a-9a25-745b5d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzE4ZTM1ZWM0YjRiNGMxNTkxYzUxNzczODZkZTE4Nzk3NDU0Mjk4Yjc0NTU5ODJlM2FlODNiYWNjZWQwZjFhMiJ9fX0=",
},
"White_Dice": {
	"name": "White_Dice",	"id": "afbe4c67-a6a5-4559-ad06-78a6ed",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzk3OTU1NDYyZTRlNTc2NjY0NDk5YWM0YTFjNTcyZjYxNDNmMTlhZDJkNjE5NDc3NjE5OGY4ZDEzNmZkYjIifX19",
},
"Red_Dice": {
	"name": "Red_Dice",	"id": "7bcf9c71-2e75-41d9-8e3d-1c74e6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTEzMWRlOGU5NTFmZGQ3YjlhM2QyMzlkN2NjM2FhM2U4NjU1YTMzNmI5OTliOWVkYmI0ZmIzMjljYmQ4NyJ9fX0=",
},
"Black_Dice": {
	"name": "Black_Dice",	"id": "f607312f-d445-4d0d-9c37-7df2e0",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTE1ZjdjMzEzYmNhOWMyZjk1OGU2OGFiMTRhYjM5Mzg2N2Q2NzUwM2FmZmZmOGYyMGNiMTNmYmU5MTdmZDMxIn19fQ==",
},
"Arrow_Up": {
	"name": "Arrow_Up",	"id": "ff1654b0-10f2-48b6-9c05-483b75",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDQ4Yjc2OGM2MjM0MzJkZmIyNTlmYjNjMzk3OGU5OGRlYzExMWY3OWRiZDZjZDg4ZjIxMTU1Mzc0YjcwYjNjIn19fQ==",
},
"Arrow_Down": {
	"name": "Arrow_Down",	"id": "9afa272b-ca4a-4502-8073-c4be1b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmRhZGQ3NTVkMDg1MzczNTJiZjdhOTNlM2JiN2RkNGQ3MzMxMjFkMzlmMmZiNjcwNzNjZDQ3MWY1NjExOTRkZCJ9fX0=",
},
"Arrow_Right": {
	"name": "Arrow_Right",	"id": "15f49744-9b61-46af-b1c3-71c626",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWI2ZjFhMjViNmJjMTk5OTQ2NDcyYWVkYjM3MDUyMjU4NGZmNmY0ZTgzMjIxZTU5NDZiZDJlNDFiNWNhMTNiIn19fQ==",
},
"Arrow_Left": {
	"name": "Arrow_Left",	"id": "69b9a08d-4e89-4878-8be8-551cae",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2ViZjkwNzQ5NGE5MzVlOTU1YmZjYWRhYjgxYmVhZmI5MGZiOWJlNDljNzAyNmJhOTdkNzk4ZDVmMWEyMyJ9fX0=",
},
"Question": {
	"name": "Question",	"id": "210665a1-0f17-4353-b85a-426e2c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTE2M2RhZmFjMWQ5MWE4YzkxZGI1NzZjYWFjNzg0MzM2NzkxYTZlMThkOGY3ZjYyNzc4ZmM0N2JmMTQ2YjYifX19",
},
"Exclamation": {
	"name": "Exclamation",	"id": "165c8c0f-d1ba-4c9e-9836-cbff5b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmE1M2JkZDE1NDU1MzFjOWViYjljNmY4OTViYzU3NjAxMmY2MTgyMGU2ZjQ4OTg4NTk4OGE3ZTg3MDlhM2Y0OCJ9fX0=",
},
"Wood_Plank": {
	"name": "Wood_Plank",	"id": "01e7a0b0-cd34-44fa-9090-eeed6f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTBlOWQyYmViODRiMzJlM2YxNWUzODBjYzJjNTUxMDY0MjkxMWE1MTIxMDVmYTJlYzY3OWJjNTQwZmQ4MTg0In19fQ==",
},
"Dot": {
	"name": "Dot",	"id": "361e6180-ceac-4838-89e5-be46fb",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzMzYWEyNDkxNmM4ODY5NmVlNzFkYjdhYzhjZDMwNmFkNzMwOTZiNWI2ZmZkODY4ZTFjMzg0YjFkNjJjZmIzYyJ9fX0=",
},
"Slash": {
	"name": "Slash",	"id": "015eeece-cc8f-46a1-acd5-cf0108",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvN2Y5NWQ3YzFiYmYzYWZhMjg1ZDhkOTY3NTdiYjU1NzIyNTlhM2FlODU0ZjUzODlkYzUzMjA3Njk5ZDk0ZmQ4In19fQ==",
},
"Birch_Log": {
	"name": "Birch_Log",	"id": "b1105fc9-e5b4-4abe-8ca7-67c36b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGY0OGIzYTQ1MjhkYzZhMjVmNDUxZmRmNmY3N2QyNTRmYzYzMWRjZmY0MzNjNDY5OTExZDY2NDFjZmYxOCJ9fX0=",
},
"Dark_Oak_Log": {
	"name": "Dark_Oak_Log",	"id": "ac55104c-32be-4bb5-988f-3b69a5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmI3M2QyOGU3M2EwZjFjOWRkOThjM2ZkMzVhYWRhYWNmOTgyOGVkNTk0OGJiMGJjZGY1ZDZmMWJkMGRjZDYzYSJ9fX0=",
},
"Jungle_Log": {
	"name": "Jungle_Log",	"id": "5635e993-7565-4416-908c-b2da2a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2JmNmVkNzVlMzNmZWI2Mjc5ZDUxODI2ZWZmM2JiNzcxZTg1NzJiZDJjNDM0NjliYWFlZGJlMzE0OTVkMzAifX19",
},
"Oak_Log": {
	"name": "Oak_Log",	"id": "bf5aefbd-7cb9-42fd-943a-361603",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmZlNTEwOWM4NmZlNmRlOGViOGFmZTMyZjA0OTZhODQ0ZGQ2NTVlNGQ0YTM5ZWY3YjBmYjYxNzkxODQ4YTVkYSJ9fX0=",
},
"Acacia_Log": {
	"name": "Acacia_Log",	"id": "1baaf61a-3d26-4b33-81ef-b206b5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWJmNmViMWQxYWEyYTFiNGRlMTNmYWRmNTM4ZDJkMzUxNjk1YWU1NmI4ODJiNTNhYmYzZTU4YTEyN2RhNWViIn19fQ==",
},
"Leaves": {
	"name": "Leaves",	"id": "89b6c13c-f51e-4e7c-a5c7-63c3ac",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDM3ZGJjNzE5MWJmYzM5YTQ1MDRlMmZhODkwYjAyNTlmNTFjMDY0ODIyMWVlZTliNDdmNGRhMmIzZDA1ZjIxIn19fQ==",
},
"Old_Leaves": {
	"name": "Old_Leaves",	"id": "66367e8b-704d-47f0-98c5-522746",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDZiODdkOWVhNzFjM2RiMGUwMTRlZTZmOGEzOWY2ZWI1Mjg4MDIxZDBmMmI3NDBlZTc5NjlmMmY5Y2MzODYifX19",
},
"Dark_Leaves": {
	"name": "Dark_Leaves",	"id": "3770a587-d3b0-4a87-9603-0b5700",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDRkNGM3ZmI5Nzk3OTE2MDIzOTNlYTY4ODg2M2FlZWYwYTE2OGFhODAwYmFmMDQ5MTJjNGEwZDNhZmMifX19",
},
"Birch_Leaves": {
	"name": "Birch_Leaves",	"id": "61c3cfc5-5eff-479b-8321-8b8796",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTdmOWNkZTIxOGI2Y2U2ZmUyYzk5MTcxYTBkY2JhYTM2MDdhOGExMTFkNTdmN2NmNGU4MDJjOGUzYjdlZGUyZiJ9fX0=",
},
"A": {
	"name": "A",	"id": "e8e10bc5-b94e-4378-a54c-ac71a6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTY3ZDgxM2FlN2ZmZTViZTk1MWE0ZjQxZjJhYTYxOWE1ZTM4OTRlODVlYTVkNDk4NmY4NDk0OWM2M2Q3NjcyZSJ9fX0=",
},
"B": {
	"name": "B",	"id": "d0f793ff-b041-427c-bc24-440834",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTBjMWI1ODRmMTM5ODdiNDY2MTM5Mjg1YjJmM2YyOGRmNjc4NzEyM2QwYjMyMjgzZDg3OTRlMzM3NGUyMyJ9fX0=",
},
"C": {
	"name": "C",	"id": "db8ddc48-84d7-4f98-bce3-0fb2d4",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWJlOTgzZWM0NzgwMjRlYzZmZDA0NmZjZGZhNDg0MjY3NjkzOTU1MWI0NzM1MDQ0N2M3N2MxM2FmMThlNmYifX19",
},
"D": {
	"name": "D",	"id": "c142dbd3-dbdf-4f46-a491-12162d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzE5M2RjMGQ0YzVlODBmZjlhOGEwNWQyZmNmZTI2OTUzOWNiMzkyNzE5MGJhYzE5ZGEyZmNlNjFkNzEifX19",
},
"E": {
	"name": "E",	"id": "96eaca3a-0f22-484f-bad7-461535",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGJiMjczN2VjYmY5MTBlZmUzYjI2N2RiN2Q0YjMyN2YzNjBhYmM3MzJjNzdiZDBlNGVmZjFkNTEwY2RlZiJ9fX0=",
},
"F": {
	"name": "F",	"id": "5d098233-5c27-4e8a-a36f-959c9e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjE4M2JhYjUwYTMyMjQwMjQ4ODZmMjUyNTFkMjRiNmRiOTNkNzNjMjQzMjU1OWZmNDllNDU5YjRjZDZhIn19fQ==",
},
"G": {
	"name": "G",	"id": "0b017eae-cd4d-48eb-9407-863e79",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWNhM2YzMjRiZWVlZmI2YTBlMmM1YjNjNDZhYmM5MWNhOTFjMTRlYmE0MTlmYTQ3NjhhYzMwMjNkYmI0YjIifX19",
},
"H": {
	"name": "H",	"id": "ba7a5f3c-db71-4827-8612-ce6bd8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzFmMzQ2MmE0NzM1NDlmMTQ2OWY4OTdmODRhOGQ0MTE5YmM3MWQ0YTVkODUyZTg1YzI2YjU4OGE1YzBjNzJmIn19fQ==",
},
"I": {
	"name": "I",	"id": "2ab25358-deaa-46b7-b351-d9732a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDYxNzhhZDUxZmQ1MmIxOWQwYTM4ODg3MTBiZDkyMDY4ZTkzMzI1MmFhYzZiMTNjNzZlN2U2ZWE1ZDMyMjYifX19",
},
"J": {
	"name": "J",	"id": "be1f1677-af64-4f59-85be-244f28",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2E3OWRiOTkyMzg2N2U2OWMxZGJmMTcxNTFlNmY0YWQ5MmNlNjgxYmNlZGQzOTc3ZWViYmM0NGMyMDZmNDkifX19",
},
"K": {
	"name": "K",	"id": "4f264d8d-87a3-496a-ad1d-eda0a2",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTQ2MWIzOGM4ZTQ1NzgyYWRhNTlkMTYxMzJhNDIyMmMxOTM3NzhlN2Q3MGM0NTQyYzk1MzYzNzZmMzdiZTQyIn19fQ==",
},
"L": {
	"name": "L",	"id": "75ae0d27-f43c-416d-96a0-fdd6db",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzE5ZjUwYjQzMmQ4NjhhZTM1OGUxNmY2MmVjMjZmMzU0MzdhZWI5NDkyYmNlMTM1NmM5YWE2YmIxOWEzODYifX19",
},
"M": {
	"name": "M",	"id": "a291bc00-e8d7-42cf-8d57-588291",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDljNDVhMjRhYWFiZjQ5ZTIxN2MxNTQ4MzIwNDg0OGE3MzU4MmFiYTdmYWUxMGVlMmM1N2JkYjc2NDgyZiJ9fX0=",
},
"N": {
	"name": "N",	"id": "439f4d78-dedd-427f-9973-c3906c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzViOGIzZDhjNzdkZmI4ZmJkMjQ5NWM4NDJlYWM5NGZmZmE2ZjU5M2JmMTVhMjU3NGQ4NTRkZmYzOTI4In19fQ==",
},
"O": {
	"name": "O",	"id": "4ec45cf0-b927-444b-85fb-f5910b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDExZGUxY2FkYjJhZGU2MTE0OWU1ZGVkMWJkODg1ZWRmMGRmNjI1OTI1NWIzM2I1ODdhOTZmOTgzYjJhMSJ9fX0=",
},
"P": {
	"name": "P",	"id": "6c22192b-5af9-4d07-a96f-f95b9e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTBhNzk4OWI1ZDZlNjIxYTEyMWVlZGFlNmY0NzZkMzUxOTNjOTdjMWE3Y2I4ZWNkNDM2MjJhNDg1ZGMyZTkxMiJ9fX0=",
},
"Q": {
	"name": "Q",	"id": "047b3876-eac3-414b-8978-1c083f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDM2MDlmMWZhZjgxZWQ0OWM1ODk0YWMxNGM5NGJhNTI5ODlmZGE0ZTFkMmE1MmZkOTQ1YTU1ZWQ3MTllZDQifX19",
},
"R": {
	"name": "R",	"id": "9af104ca-dfbb-4616-9101-d10016",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTVjZWQ5OTMxYWNlMjNhZmMzNTEzNzEzNzliZjA1YzYzNWFkMTg2OTQzYmMxMzY0NzRlNGU1MTU2YzRjMzcifX19",
},
"S": {
	"name": "S",	"id": "826bfe2f-387c-44d7-9cd3-fc3046",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2U0MWM2MDU3MmM1MzNlOTNjYTQyMTIyODkyOWU1NGQ2Yzg1NjUyOTQ1OTI0OWMyNWMzMmJhMzNhMWIxNTE3In19fQ==",
},
"T": {
	"name": "T",	"id": "08c08ff3-95f3-44cc-8da3-d0e133",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTU2MmU4YzFkNjZiMjFlNDU5YmU5YTI0ZTVjMDI3YTM0ZDI2OWJkY2U0ZmJlZTJmNzY3OGQyZDNlZTQ3MTgifX19",
},
"U": {
	"name": "U",	"id": "dd376034-312d-4515-9c70-eafbba",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjA3ZmJjMzM5ZmYyNDFhYzNkNjYxOWJjYjY4MjUzZGZjM2M5ODc4MmJhZjNmMWY0ZWZkYjk1NGY5YzI2In19fQ==",
},
"V": {
	"name": "V",	"id": "18724f9a-8aab-4f3f-a0ff-26e4b7",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2M5YTEzODYzOGZlZGI1MzRkNzk5Mjg4NzZiYWJhMjYxYzdhNjRiYTc5YzQyNGRjYmFmY2M5YmFjNzAxMGI4In19fQ==",
},
"W": {
	"name": "W",	"id": "20816a64-5743-4624-8d5e-00549a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjY5YWQxYTg4ZWQyYjA3NGUxMzAzYTEyOWY5NGU0YjcxMGNmM2U1YjRkOTk1MTYzNTY3ZjY4NzE5YzNkOTc5MiJ9fX0=",
},
"X": {
	"name": "X",	"id": "33b5946c-20d1-466f-8dd5-11a0fd",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWE2Nzg3YmEzMjU2NGU3YzJmM2EwY2U2NDQ5OGVjYmIyM2I4OTg0NWU1YTY2YjVjZWM3NzM2ZjcyOWVkMzcifX19",
},
"Y": {
	"name": "Y",	"id": "579ec4fb-0baf-4716-89ba-1c175f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzUyZmIzODhlMzMyMTJhMjQ3OGI1ZTE1YTk2ZjI3YWNhNmM2MmFjNzE5ZTFlNWY4N2ExY2YwZGU3YjE1ZTkxOCJ9fX0=",
},
"Z": {
	"name": "Z",	"id": "0f3a3e42-4410-48a6-9d46-97392e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTA1ODJiOWI1ZDk3OTc0YjExNDYxZDYzZWNlZDg1ZjQzOGEzZWVmNWRjMzI3OWY5YzQ3ZTFlMzhlYTU0YWU4ZCJ9fX0=",
},
"1": {
	"name": "1",	"id": "00684a88-5cc8-4713-9e91-7b1906",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzFiYzJiY2ZiMmJkMzc1OWU2YjFlODZmYzdhNzk1ODVlMTEyN2RkMzU3ZmMyMDI4OTNmOWRlMjQxYmM5ZTUzMCJ9fX0=",
},
"2": {
	"name": "2",	"id": "f7218833-aceb-4d3e-a1bc-a334be",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGNkOWVlZWU4ODM0Njg4ODFkODM4NDhhNDZiZjMwMTI0ODVjMjNmNzU3NTNiOGZiZTg0ODczNDE0MTk4NDcifX19",
},
"3": {
	"name": "3",	"id": "870c6ce6-78b5-4e09-8745-bd96d6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWQ0ZWFlMTM5MzM4NjBhNmRmNWU4ZTk1NTY5M2I5NWE4YzNiMTVjMzZiOGI1ODc1MzJhYzA5OTZiYzM3ZTUifX19",
},
"4": {
	"name": "4",	"id": "d531b607-3d92-4760-b19f-b64d51",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDJlNzhmYjIyNDI0MjMyZGMyN2I4MWZiY2I0N2ZkMjRjMWFjZjc2MDk4NzUzZjJkOWMyODU5ODI4N2RiNSJ9fX0=",
},
"5": {
	"name": "5",	"id": "4aaa0af9-ffde-4f5a-ad06-112dff",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmQ1N2UzYmM4OGE2NTczMGUzMWExNGUzZjQxZTAzOGE1ZWNmMDg5MWE2YzI0MzY0M2I4ZTU0NzZhZTIifX19",
},
"6": {
	"name": "6",	"id": "58a05887-3473-4c87-8506-2acf87",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzM0YjM2ZGU3ZDY3OWI4YmJjNzI1NDk5YWRhZWYyNGRjNTE4ZjVhZTIzZTcxNjk4MWUxZGNjNmIyNzIwYWIifX19",
},
"7": {
	"name": "7",	"id": "23378bd2-28e5-4d7e-8d39-621b73",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmRiNmViMjVkMWZhYWJlMzBjZjQ0NGRjNjMzYjU4MzI0NzVlMzgwOTZiN2UyNDAyYTNlYzQ3NmRkN2I5In19fQ==",
},
"8": {
	"name": "8",	"id": "19c144be-a435-42a4-9503-83bcd8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTkxOTQ5NzNhM2YxN2JkYTk5NzhlZDYyNzMzODM5OTcyMjI3NzRiNDU0Mzg2YzgzMTljMDRmMWY0Zjc0YzJiNSJ9fX0=",
},
"9": {
	"name": "9",	"id": "c7cad554-93b2-4176-a4ba-8de42a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTY3Y2FmNzU5MWIzOGUxMjVhODAxN2Q1OGNmYzY0MzNiZmFmODRjZDQ5OWQ3OTRmNDFkMTBiZmYyZTViODQwIn19fQ==",
},
"0": {
	"name": "0",	"id": "2298cff2-c1a5-4278-a277-8d8661",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMGViZTdlNTIxNTE2OWE2OTlhY2M2Y2VmYTdiNzNmZGIxMDhkYjg3YmI2ZGFlMjg0OWZiZTI0NzE0YjI3In19fQ==",
},
"Blaze": {
	"name": "Blaze",	"id": "7ceb88b2-7f5f-4399-abb9-706825",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjc4ZWYyZTRjZjJjNDFhMmQxNGJmZGU5Y2FmZjEwMjE5ZjViMWJmNWIzNWE0OWViNTFjNjQ2Nzg4MmNiNWYwIn19fQ==",
},
"Cave_Spider": {
	"name": "Cave_Spider",	"id": "39173a7a-c957-4ec1-ac1a-43e5a6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDE2NDVkZmQ3N2QwOTkyMzEwN2IzNDk2ZTk0ZWViNWMzMDMyOWY5N2VmYzk2ZWQ3NmUyMjZlOTgyMjQifX19",
},
"Ghast": {
	"name": "Ghast",	"id": "807f287f-6499-4e93-a887-0a298a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGI2YTcyMTM4ZDY5ZmJiZDJmZWEzZmEyNTFjYWJkODcxNTJlNGYxYzk3ZTVmOTg2YmY2ODU1NzFkYjNjYzAifX19",
},
"Pigzombie": {
	"name": "Pigzombie",	"id": "6540c046-d6ea-4aff-9766-32a54e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzRlOWM2ZTk4NTgyZmZkOGZmOGZlYjMzMjJjZDE4NDljNDNmYjE2YjE1OGFiYjExY2E3YjQyZWRhNzc0M2ViIn19fQ==",
},
"Enderman": {
	"name": "Enderman",	"id": "0de98464-1274-4dd6-bba8-370efa",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvN2E1OWJiMGE3YTMyOTY1YjNkOTBkOGVhZmE4OTlkMTgzNWY0MjQ1MDllYWRkNGU2YjcwOWFkYTUwYjljZiJ9fX0=",
},
"Lava_Slime": {
	"name": "Lava_Slime",	"id": "96aced64-5b85-4b99-b825-53cd7a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzg5NTdkNTAyM2M5MzdjNGM0MWFhMjQxMmQ0MzQxMGJkYTIzY2Y3OWE5ZjZhYjM2Yjc2ZmVmMmQ3YzQyOSJ9fX0=",
},
"Slime": {
	"name": "Slime",	"id": "9aca565d-105c-4e8c-81fc-740545",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTZhZDIwZmMyZDU3OWJlMjUwZDNkYjY1OWM4MzJkYTJiNDc4YTczYTY5OGI3ZWExMGQxOGM5MTYyZTRkOWI1In19fQ==",
},
"Spider": {
	"name": "Spider",	"id": "8bdb71d0-4724-48b2-9344-e79480",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2Q1NDE1NDFkYWFmZjUwODk2Y2QyNThiZGJkZDRjZjgwYzNiYTgxNjczNTcyNjA3OGJmZTM5MzkyN2U1N2YxIn19fQ==",
},
"Chicken": {
	"name": "Chicken",	"id": "7d3a8ace-e045-4eba-ab71-71dbf5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTYzODQ2OWE1OTljZWVmNzIwNzUzNzYwMzI0OGE5YWIxMWZmNTkxZmQzNzhiZWE0NzM1YjM0NmE3ZmFlODkzIn19fQ==",
},
"Pig": {
	"name": "Pig",	"id": "e1e1c2e4-1ed2-473d-bde2-3ec718",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjIxNjY4ZWY3Y2I3OWRkOWMyMmNlM2QxZjNmNGNiNmUyNTU5ODkzYjZkZjRhNDY5NTE0ZTY2N2MxNmFhNCJ9fX0=",
},
"Sheep": {
	"name": "Sheep",	"id": "fa234925-9dbe-4b8f-a544-7c70fb",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjMxZjljY2M2YjNlMzJlY2YxM2I4YTExYWMyOWNkMzNkMThjOTVmYzczZGI4YTY2YzVkNjU3Y2NiOGJlNzAifX19",
},
"Cow": {
	"name": "Cow",	"id": "97ddf3b3-9dbe-4a3b-8a0f-1b19dd",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWQ2YzZlZGE5NDJmN2Y1ZjcxYzMxNjFjNzMwNmY0YWVkMzA3ZDgyODk1ZjlkMmIwN2FiNDUyNTcxOGVkYzUifX19",
},
"Squid": {
	"name": "Squid",	"id": "f95d9504-ea2b-4b89-b2d0-d40065",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMDE0MzNiZTI0MjM2NmFmMTI2ZGE0MzRiODczNWRmMWViNWIzY2IyY2VkZTM5MTQ1OTc0ZTljNDgzNjA3YmFjIn19fQ==",
},
"Villager": {
	"name": "Villager",	"id": "0a9e8efb-9191-4c81-80f5-e27ca5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODIyZDhlNzUxYzhmMmZkNGM4OTQyYzQ0YmRiMmY1Y2E0ZDhhZThlNTc1ZWQzZWIzNGMxOGE4NmU5M2IifX19",
},
"Golem": {
	"name": "Golem",	"id": "7cb6e9a5-994f-40d5-9bfc-4ba5d7",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODkwOTFkNzllYTBmNTllZjdlZjk0ZDdiYmE2ZTVmMTdmMmY3ZDQ1NzJjNDRmOTBmNzZjNDgxOWE3MTQifX19",
},
"Herobrine": {
	"name": "Herobrine",	"id": "d0b15454-36fa-43e4-a247-f882bb",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOThiN2NhM2M3ZDMxNGE2MWFiZWQ4ZmMxOGQ3OTdmYzMwYjZlZmM4NDQ1NDI1YzRlMjUwOTk3ZTUyZTZjYiJ9fX0=",
},
"Mushroom_Cow": {
	"name": "Mushroom_Cow",	"id": "e206ac29-ae69-475b-909a-fb523d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDBiYzYxYjk3NTdhN2I4M2UwM2NkMjUwN2EyMTU3OTEzYzJjZjAxNmU3YzA5NmE0ZDZjZjFmZTFiOGRiIn19fQ==",
},
"Ocelot": {
	"name": "Ocelot",	"id": "664dd492-3fcd-443b-9e61-4c7ebd",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTY1N2NkNWMyOTg5ZmY5NzU3MGZlYzRkZGNkYzY5MjZhNjhhMzM5MzI1MGMxYmUxZjBiMTE0YTFkYjEifX19",
},
"Horse_Head": {
	"name": "Horse_Head",	"id": "39023647-b293-4555-8b0f-b55157",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjE5MDI4OTgzMDg3MzBjNDc0NzI5OWNiNWE1ZGE5YzI1ODM4YjFkMDU5ZmU0NmZjMzY4OTZmZWU2NjI3MjkifX19",
},
"Guardian": {
	"name": "Guardian",	"id": "2e9c0a67-92b3-4949-9be1-faf123",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTMyYzI0NTI0YzgyYWIzYjNlNTdjMjA1MmM1MzNmMTNkZDhjMGJlYjhiZGQwNjM2OWJiMjU1NGRhODZjMTIzIn19fQ==",
},
"Monkey": {
	"name": "Monkey",	"id": "bf766742-b48b-4235-8fae-f608dc",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzQyOWNhOWM2YTJlOGJiMTYyNzU3ZjU0M2FkYjYyZWY1OGY2NjVkNGUwZGZjY2U1ZGFmNThkMjhmZDlkZmIifX19",
},
"Polar_Bear": {
	"name": "Polar_Bear",	"id": "87324464-1700-468f-8333-e7779e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDQ2ZDIzZjA0ODQ2MzY5ZmEyYTM3MDJjMTBmNzU5MTAxYWY3YmZlODQxOTk2NjQyOTUzM2NkODFhMTFkMmIifX19",
},
"Penguin": {
	"name": "Penguin",	"id": "53c01f77-c4bd-458e-8fd8-70f7bb",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDNjNTdmYWNiYjNhNGRiN2ZkNTViNWMwZGM3ZDE5YzE5Y2IwODEzYzc0OGNjYzk3MTBjNzE0NzI3NTUxZjViOSJ9fX0=",
},
"Walrus": {
	"name": "Walrus",	"id": "a185ff1a-f32e-47e0-be61-5a612f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDdiYWVkYWY5YWQ5NTQ3NGViMWJlNTg5MjQ0NDVkZmM3N2JiZGMyNTJjYzFjODE2NDRjZjcxNTRjNDQxIn19fQ==",
},
"Tiger": {
	"name": "Tiger",	"id": "44f40896-48d1-42cb-bfb6-8edace",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjZiOTZiYmM4YWQ5YmFlMGUyNTRkMzVmZGZiMWRiNDhlODIyZWQ5N2NmNWY3MzlkM2U5NTQ1ZGQ2Y2UifX19",
},
"Panda": {
	"name": "Panda",	"id": "00d08322-5eb2-44be-b9a2-7921a9",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDE4OGM5ODBhYWNmYTk0Y2YzMzA4ODUxMmIxYjk1MTdiYTgyNmIxNTRkNGNhZmMyNjJhZmY2OTc3YmU4YSJ9fX0=",
},
"Cat": {
	"name": "Cat",	"id": "feb547f7-43e0-4ec4-a437-f0d57b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjVjOTVjMWYyYTUwYjM3ZDYxMjZmNzZlNDYxOGE0Y2M3OTI3OWE4Yzg0NDM3MjA1NGRjM2IyMmVhMWNlMjcifX19",
},
"Angry_Wolf": {
	"name": "Angry_Wolf",	"id": "9a7c65fb-309f-4c1a-96a1-4522c1",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTk1Y2JiNGY3NWVhODc2MTdmMmY3MTNjNmQ0OWRhYzMyMDliYTFiZDRiOTM2OTY1NGIxNDU5ZWExNTMxNyJ9fX0=",
},
"Rabbit": {
	"name": "Rabbit",	"id": "15908cee-0f9c-45ca-bf9c-fad9b0",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGM3YTMxN2VjNWMxZWQ3Nzg4Zjg5ZTdmMWE2YWYzZDJlZWI5MmQxZTk4NzljMDUzNDNjNTdmOWQ4NjNkZTEzMCJ9fX0=",
},
"Koala": {
	"name": "Koala",	"id": "10100199-d136-490d-9139-6ee644",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2EzNWViMTBiOTRlODg4NDI3ZmIyM2M3ODMwODI2NThjZWI4MWYzY2Y1ZDBhYWQyNWQ3ZDQxYTE5NGIyNiJ9fX0=",
},
"Chinese_Dragon": {
	"name": "Chinese_Dragon",	"id": "d59d6bbe-4182-496e-95b0-bcd78c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTE2NDFkMDM4ZWIzODYyYjFlMDIyYzVlMDU4OGQ5NjM2NmRhMWM5NDRlZTVlNmVlMTNlMGY1ZGQ3YjQyN2IifX19",
},
"Villager_head": {
	"name": "Villager_head",	"id": "8b4c32c4-1280-444d-8e76-587ad9",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzdlNTc1Y2ZmMTEwMTRhNWFjYWRmMzNlZTQ4ODU2OGNjODllNDMxOTM1MTFjYTc0ZWZjODNlZWJiNzZmNCJ9fX0=",
},
"Pufferfish": {
	"name": "Pufferfish",	"id": "b4630012-0e65-4a3d-bfd6-5024b7",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTk1NTkzODg5OTNmZTc4MmY2N2JkNThkOThjNGRmNTZiY2Q0MzBlZGNiMmY2NmVmNTc3N2E3M2MyN2RlMyJ9fX0=",
},
"Wither_Boss": {
	"name": "Wither_Boss",	"id": "119c371b-ea16-47c9-ad7f-23b3d8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2RmNzRlMzIzZWQ0MTQzNjk2NWY1YzU3ZGRmMjgxNWQ1MzMyZmU5OTllNjhmYmI5ZDZjZjVjOGJkNDEzOWYifX19",
},
"Snowhead": {
	"name": "Snowhead",	"id": "673db4c6-b7ea-421e-ae35-d7ab65",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWZkZmQxZjc1MzhjMDQwMjU4YmU3YTkxNDQ2ZGE4OWVkODQ1Y2M1ZWY3MjhlYjVlNjkwNTQzMzc4ZmNmNCJ9fX0=",
},
"Snowhead_2": {
	"name": "Snowhead_2",	"id": "0b5c7a8a-45bd-4054-8816-80291a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTUyOGRmMTY1Mzk2MmU0ZTk5NWRmZDA2NGE3MmIyY2JmZjliNzE5NzkxMjg4MDE0M2Y5NDFhMzdkYjQ2YyJ9fX0=",
},
"Podzol": {
	"name": "Podzol",	"id": "27743c84-c5fa-4334-848b-c2fd29",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTQxOTVmOWE0MzljNmQwZmZkMTk2MTY1N2Y2ZjBhYThlM2EyZjhhMjQ5M2FmYTY2MmFiNWU0MTkzZTAifX19",
},
"Grass": {
	"name": "Grass",	"id": "fe02ba7c-6fb4-458d-af7d-85a72a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzQ5YzYzYmM1MDg3MjMzMjhhMTllNTk3ZjQwODYyZDI3YWQ1YzFkNTQ1NjYzYWMyNDQ2NjU4MmY1NjhkOSJ9fX0=",
},
"Snow_Grass": {
	"name": "Snow_Grass",	"id": "7a419c21-9074-43b7-a443-df76fd",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDNjNTJlYWU3NDdjYWQ1YjRmZDE5YjFhMjNiMzlhMzM2YjYyZWQ0MjI3OTdhNjIyZDA0NWY0M2U1ZDM4In19fQ==",
},
"Dirt": {
	"name": "Dirt",	"id": "ca021f3f-5002-46b2-bf34-985779",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWFiNDNiOGMzZDM0ZjEyNWU1YTNmOGI5MmNkNDNkZmQxNGM2MjQwMmMzMzI5ODQ2MWQ0ZDRkN2NlMmQzYWVhIn19fQ==",
},
"Mycellium": {
	"name": "Mycellium",	"id": "359b3739-61e7-4d35-b9d8-5f6b66",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvN2ViNGM0MWY0ODFlODE2Y2Y0YjUwN2IwYTE3NTk1ZjJiYTFmMjQ2NjRkYzQzMmJlMzQ3ZDRlN2E0ZWIzIn19fQ==",
},
"Red_Sand": {
	"name": "Red_Sand",	"id": "0e33173e-1e75-4207-9484-8ecbe3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGNlNDFlNjg3OWRmZjA3ODVkMTRjYjc2OTRlYTZiMGRmMTkyYjk2Yjg4MTYwMTNlYjQ1NWU3MTU1MmZjZTZhIn19fQ==",
},
"Sand": {
	"name": "Sand",	"id": "318fe287-3b79-467b-a29e-8cec14",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDdkN2Q3MmU3OGYzNWRlY2QyYjA4ZWE5Yjc0NzkwZTVjZDdlMjY0ODRjZjI0NDliZGVjYTRmNzhiYTMifX19",
},
"Soulsand": {
	"name": "Soulsand",	"id": "5572f2b0-5953-43e5-8d96-2895c3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWVhNmY5MzJiNDVmZGYzYjY5M2Q5ZTQ0YmQwNWJjYTM2NGViNWI5YWZmNDk3MjI2ZmRiNTJhYmIyNDM2NDIyIn19fQ==",
},
"Netherrack": {
	"name": "Netherrack",	"id": "880942dd-7665-46b8-845c-5720c6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWVjZThlODM4MzU2M2JjZWY1ZDVhZTBiMWJmZmVkMWQ2MTU4YjlhYjdjMWFjODM0NGMxOGFjNDhmNmI2YTIifX19",
},
"Netherbrick": {
	"name": "Netherbrick",	"id": "9177fd08-9984-41d5-b430-c9f565",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzYwYjJmOTE0NTIxNWEzYTUwNjVkY2EyZDg5YmI4YjRjYTQ0YjkyMjJkZDIyMDYwYjUxYzM4ZDliZjU4NyJ9fX0=",
},
"Quartz_Ore": {
	"name": "Quartz_Ore",	"id": "a606ea8d-ffb6-4b9a-a1ec-96c1b4",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjZkZTU4ZDU4M2MxMDNjMWNkMzQ4MjQzODBjOGE0NzdlODk4ZmRlMmViOWE3NGU3MWYxYTk4NTA1M2I5NiJ9fX0=",
},
"Enderpearl": {
	"name": "Enderpearl",	"id": "4d017365-f5b1-43e2-8bbd-fecc5a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGUzNWFhZGU4MTI5MmU2ZmY0Y2QzM2RjMGVhNmExMzI2ZDA0NTk3YzBlNTI5ZGVmNDE4MmIxZDE1NDhjZmUxIn19fQ==",
},
"Endereye": {
	"name": "Endereye",	"id": "51dda14c-10ab-4365-b01d-5175c5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODcyZDM0MWQ3N2RiZGU2ZDUzZGFkNjFiZjE5MjUyNGRiZGI5NmFmMTM1OGUwNzQ4ZmVlYTE0ODFiMWY4In19fQ==",
},
"Ender_Portal": {
	"name": "Ender_Portal",	"id": "f284df11-30a4-4163-818b-94d93a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTRhMzE5ZGVhZmVmZDZhZGIzN2YyMTQ0OWVhNTZkM2VhNWE4Mzg1N2ZiOTYxNmZhN2Q0ZjllYTYyNTE3NyJ9fX0=",
},
"Ice_Block": {
	"name": "Ice_Block",	"id": "59dfcbad-d090-4857-8591-abdd1a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODcyZDliOThhNmIzNGEyNzYyYWFjMWFmOTE1ODczYzA2NmM0M2MyYjJiOGQ2ODlkMjc2MjZjYzVhZmNiMTEifX19",
},
"Water": {
	"name": "Water",	"id": "0b582b1b-8de8-4b5f-bfc6-d2585b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWM3ZWNiZmQ2ZDMzZTg3M2ExY2Y5YTkyZjU3ZjE0NjE1MmI1MmQ5ZDczMTE2OTQ2MDI2NzExMTFhMzAyZiJ9fX0=",
},
"Lava": {
	"name": "Lava",	"id": "1d807ac3-018d-46ee-98b3-51a9f3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjY5NjVlNmE1ODY4NGMyNzdkMTg3MTdjZWM5NTlmMjgzM2E3MmRmYTk1NjYxMDE5ZGJjZGYzZGJmNjZiMDQ4In19fQ==",
},
"Emerald_Block": {
	"name": "Emerald_Block",	"id": "5dbeafba-01c0-4e25-bfec-1cd45d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWYxMjFmN2MxYWIxNTY3ZmYyMTk4M2ZmN2E5ZTU1YzQwYzBiODY1ZjA1MGQzN2U1ZDM1ZGVmYmFhIn19fQ==",
},
"Diamond_Block": {
	"name": "Diamond_Block",	"id": "676629d7-3add-440c-8017-663d29",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzAxNDYxOTczNjM0NTI1MTk2ZWNjNzU3NjkzYjE3MWFkYTRlZjI0YWE5MjgzNmY0MmVhMTFiZDc5YzNhNTAyZCJ9fX0=",
},
"Gold_Block": {
	"name": "Gold_Block",	"id": "8178b3d7-b6a6-471c-bc70-15f9c5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjZkMWNlNjk3ZTlkYmFhNGNjZjY0MjUxNmFhYTU5ODEzMzJkYWMxZDMzMWFmZWUyZWUzZGNjODllZmRlZGIifX19",
},
"Iron_Block": {
	"name": "Iron_Block",	"id": "03924288-5902-412c-a6ea-a6eb03",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmJhODQ1OTE0NWQ4M2ZmYzQ0YWQ1OGMzMjYwZTc0Y2E1YTBmNjM0YzdlZWI1OWExYWQzMjM0ODQ5YzkzM2MifX19",
},
"Emerald_Ore": {
	"name": "Emerald_Ore",	"id": "e03854c8-c1b7-4cbd-a319-c62f30",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGZjNDk1ZDFlNmViNTRhMzg2MDY4YzZjYjEyMWM1ODc1ZTAzMWI3ZjYxZDcyMzZkNWYyNGI3N2RiN2RhN2YifX19",
},
"Redstone_Ore": {
	"name": "Redstone_Ore",	"id": "533c8b68-908c-424f-a6a9-d0228d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZThkZWVlNTg2NmFiMTk5ZWRhMWJkZDc3MDdiZGI5ZWRkNjkzNDQ0ZjFlM2JkMzM2YmQyYzc2NzE1MWNmMiJ9fX0=",
},
"Diamond_Ore": {
	"name": "Diamond_Ore",	"id": "81f4b80a-a1b2-495f-93ff-229685",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjg4Y2Q2ZGQ1MDM1OWM3ZDU4OThjN2M3ZTNlMjYwYmZjZDNkY2IxNDkzYTg5YjllODhlOWNiZWNiZmU0NTk0OSJ9fX0=",
},
"Iron_Ore": {
	"name": "Iron_Ore",	"id": "b584d8d1-a5e3-49cf-85db-cfc9a8142274",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGI5N2JkZjkyYjYxOTI2ZTM5ZjVjZGRmMTJmOGY3MTMyOTI5ZGVlNTQxNzcxZTBiNTkyYzhiODJjOWFkNTJkIn19fQ==",
},
"Gold_Ore": {
	"name": "Gold_Ore",	"id": "f7639653-f9b7-41ce-b19a-decf57",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTRkZjg5MjI5M2E5MjM2ZjczZjQ4ZjllZmU5NzlmZTA3ZGJkOTFmN2I1ZDIzOWU0YWNmZDM5NGY2ZWNhIn19fQ==",
},
"Cobblestone": {
	"name": "Cobblestone",	"id": "b966f5be-50de-4813-8233-472103",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTk1NTM0ZTAyYzU5YjMzZWNlNTYxOTI4MDMzMTk3OTc3N2UwMjVmYTVmYTgxYWU3NWU5OWZkOGVmZGViYjgifX19",
},
"Stone": {
	"name": "Stone",	"id": "bbab75d5-1d7d-4ba6-95e4-63d64a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGU5YjhhYWU3ZjljYzc2ZDYyNWNjYjhhYmM2ODZmMzBkMzhmOWU2YzQyNTMzMDk4YjlhZDU3N2Y5MWMzMzNjIn19fQ==",
},
"Stone_Brick": {
	"name": "Stone_Brick",	"id": "e56df097-718e-4961-8eb7-6a1009",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzdhMmMxOGZmYTRkM2Y0MjE2YjI0MTQxNzllY2Q4OGFlNzllNmIxZTBlODljN2JmMjVkZDM1OTk0ZjdiOTYifX19",
},
"Stone_Brick_2": {
	"name": "Stone_Brick_2",	"id": "9fec1436-b953-4ac6-8aab-19c07f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmEzYmI5M2I5OTMzNjg5YmM1MDg4ZGVjNzMwYmJlODU5ZDgyNmI2ZGFkNWZmZDc3M2MyZDJiOGY4NDdmNWYifX19",
},
"Chimney": {
	"name": "Chimney",	"id": "489e312d-00bc-4656-8872-0f9be2",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzA1OGVjNGQzOTIwYWRiZmE4NjU1MGY1ODUyNDIyZTFhZjU1MDU0YTE1YWZjOWMyYzkyMmQ1ODc2NWZhYTViIn19fQ==",
},
"Crafting_Table": {
	"name": "Crafting_Table",	"id": "e46c1685-b94d-4785-90d5-e86f82",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2U3ZDhjMjQyZDJlNGY4MDI4ZjkzMGJlNzZmMzUwMTRiMjFiNTI1NTIwOGIxYzA0MTgxYjI1NzQxMzFiNzVhIn19fQ==",
},
"Bedrock": {
	"name": "Bedrock",	"id": "160c4479-dea8-4726-be18-45e8e1",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzZkMWZhYmRmM2UzNDI2NzFiZDlmOTVmNjg3ZmUyNjNmNDM5ZGRjMmYxYzllYThmZjE1YjEzZjFlN2U0OGI5In19fQ==",
},
"Brick": {
	"name": "Brick",	"id": "b06b1e8b-f727-4628-9e02-12331b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjkwZDRmY2IyY2UwM2I5NGQ5MjBmMGE5ZTdhNTRiMzJjZmM3YTFkMzNhNmRmZTk3NTdkODY3OGNiYjU5MSJ9fX0=",
},
"Quartz_Block": {
	"name": "Quartz_Block",	"id": "bd68e00c-595d-4e33-ad97-31e7dc",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTVlMmIyZWQyOThiNTNjYzg0NzgzY2Q3ODVlYzU3ZGE0OWNlYWFiZGNmZjMxYjI1ZmU1MjU2YjM0MjliNDEyIn19fQ==",
},
"Slime_Ball": {
	"name": "Slime_Ball",	"id": "d9316bb7-755b-4141-a4c9-c6958d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDkzNGE5ZjVhYjE3ODlhN2Q4ZGQ5NmQzMjQ5M2NkYWNmZjU3N2Q4YzgxZTdiMjM5MTdkZmYyZTMyYmQwYmMxMCJ9fX0=",
},
"Redstone_Lamp_(On)": {
	"name": "Redstone_Lamp_(On)",	"id": "b6864e28-93f7-4c61-b497-8f2261",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWFmZjkzZWJlY2MxZjhmYmQxM2JhNzgzOWVjN2JkY2RlY2FiN2MwN2ZkOGJhNzhlZTc4YWQwYmQzYWNjYmUifX19",
},
"Piston": {
	"name": "Piston",	"id": "059da2c0-8983-4f4a-b4a8-4dd409",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTI3NDNhOGJlYTc1MmQ2ZGFmNjcyZGVhMzY3ZTFhNWQzOThhZWNiZTBjM2M4NDgzYTkwZWM5YWM0NDEyYTQxIn19fQ==",
},
"Sticky_Piston": {
	"name": "Sticky_Piston",	"id": "92c42f6c-6465-4058-b33b-2dbf31",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvN2NhNGQyMThkZjlkMzJjZDQ3ZDljMWQyOTQ4NzcxMjJiZTU5MTliNDE4YTZjYzNkMDg5MTYyYjEzM2YyZGIifX19",
},
"Slime_Piston": {
	"name": "Slime_Piston",	"id": "7e654e6a-3a82-4209-9b1d-ca83dd",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjcxMTMxNWUzNzAxZDY2YzUzMTU0YWFjOTk1ZDY0ZmY3ZjgwYmU4ZTExZDI3MTJkOTI5OGRiYWJkNzFkNiJ9fX0=",
},
"Half_Piston": {
	"name": "Half_Piston",	"id": "f7cc2cd3-4843-47b6-84d5-678222",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWE4NjhjZTkxN2MwOWFmOGU0YzM1MGE1ODA3MDQxZjY1MDliZjJiODlhY2E0NWU1OTFmYmJkN2Q0YjExN2QifX19",
},
"Dropper": {
	"name": "Dropper",	"id": "4b99354f-89aa-4fb6-94b6-908db5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjMyNmYwZTczOTM1M2QyZDdjOGU5YWI0ZTkxZTFmYmVjNjA3Y2FkMGZlMTAyOTZhZmQyMWQ2MzNiOWVjZWUifX19",
},
"Dropper_2": {
	"name": "Dropper_2",	"id": "50013dff-85c9-4ac7-8c5e-31307c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjVlOTE1MmVmZDg5MmY2MGQ3ZTBkN2U1MzM2OWUwNDc3OWVkMzExMWUyZmIyNzUyYjZmNGMyNmRmNTQwYWVkYyJ9fX0=",
},
"Redstone_Torch": {
	"name": "Redstone_Torch",	"id": "a8f5a413-8ff3-4d04-a3b9-355854",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzJiMGEyNzA5YWQyN2M1NzgzYmE3YWNiZGFlODc4N2QxNzY3M2YwODg4ZjFiNmQ0ZTI0ZWUxMzI5OGQ0In19fQ==",
},
"Redstone_Torch_2": {
	"name": "Redstone_Torch_2",	"id": "7123b283-374f-40e4-985d-d3e5e2",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWM5ZTM3ZjU5OWM1NTY5OGQzODczYzg3MTRkOWYzYTQwODc1MWMwMTI3MWE3ODllMmNlM2U3ZTlhMmRjNCJ9fX0=",
},
"Redstone_Block": {
	"name": "Redstone_Block",	"id": "4feade5d-26ec-4398-a0d8-537e6d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDA4ZWU2ZWRmYTk4ZGI1ZWFlOWI5Yzk5MzZlOTQ0ODliMmQ0YmJiZDNkMmI0YjZiNDg4NWEzMjI0MDYxM2MifX19",
},
"TNT": {
	"name": "TNT",	"id": "495ced5c-8107-47bf-bfd7-048f8d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzI4YTE4MTU2ODlkNzE5NGNmN2RiMDYxYjU5ZjYzMTA2MjY0YjUxMzg3OTc2YTdmYjc0YWI3OWI1NjQxIn19fQ==",
},
"TNT_2": {
	"name": "TNT_2",	"id": "125c5512-a63b-4e6a-a710-e7afd3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWI5OTRiNDFmMDdmODdiMzI4MTg2YWNmY2JkYWJjNjk5ZDViMTg0N2ZhYmIyZTQ5ZDVhYmMyNzg2NTE0M2E0ZSJ9fX0=",
},
"Jukebox": {
	"name": "Jukebox",	"id": "f54d9275-d1e6-4d62-b9a9-2b76fa",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmRlNGI1M2I3OGVjMWM3NGQ1YjAxZjdmM2I1NTgzMjg5MmIwNDdmYWMxNTVmNTM0YTc0ZTcxNzgyMWMyYWQifX19",
},
"Jukebox_2": {
	"name": "Jukebox_2",	"id": "34d1efae-565e-4e59-ab9c-ee74df",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTYyMGI4MmNmMTFlM2MxMzcxY2M1MWViOWUzMTJkZTcyYTZhNjI2NjQ0OTRlZDJjYjcxODFiMWJkZmJjOTI3OCJ9fX0=",
},
"Sponge": {
	"name": "Sponge",	"id": "27478235-3a09-4645-8231-63b1c5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTYxM2ZkYWI0M2Q3NjgzOGI3YjhjMTkyNDQxNjNmMTc2NWRiODc0YmRmMTUxNjk2YmRjYjY1NGViMmU1MiJ9fX0=",
},
"Sky_Blue": {
	"name": "Sky_Blue",	"id": "530c5043-eb73-459b-aaf9-9f91d4",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzE0ODJiNzU1ODU4NjU3ZmI1MWI3ZDNmYmY0Y2Q4YzA5MGMwNWUzNWJkOGNkYmE5OGIxOTQ5OWQ3ODMzYWNiMiJ9fX0=",
},
"Sky_Blue_2": {
	"name": "Sky_Blue_2",	"id": "41227d46-3350-4aea-b3e1-4c7480",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDg5Y2U4OTUyNmZjMTI2MjQ2NzhmMzA1NDkzYWE2NWRhOGExYjM2MDU0NmE1MDVkMTE4ZWIxZmFkNzc1In19fQ==",
},
"Baby_Blue": {
	"name": "Baby_Blue",	"id": "76ee0c4a-0a78-4ebb-ab14-31a492",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvN2QzMWQyMWNiNTQyOTRlZTNhMjA1NjEzN2QxMjNiNTc2Zjc4YmZjNDg3OGNkODE0NGNkNTFlMTkzMWMzOWI1In19fQ==",
},
"Bright_Green": {
	"name": "Bright_Green",	"id": "aa5f432b-59ee-4db5-b58e-013828",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzYxZTViMzMzYzJhMzg2OGJiNmE1OGI2Njc0YTI2MzkzMjM4MTU3MzhlNzdlMDUzOTc3NDE5YWYzZjc3In19fQ==",
},
"Green": {
	"name": "Green",	"id": "c8fee7ee-b067-48cb-80c8-337a63",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzZmNjlmN2I3NTM4YjQxZGMzNDM5ZjM2NThhYmJkNTlmYWNjYTM2NmYxOTBiY2YxZDZkMGEwMjZjOGY5NiJ9fX0=",
},
"Grass_Green": {
	"name": "Grass_Green",	"id": "1924b74f-48e6-4b7b-be04-c2e6a8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2FkMDE1OTJjYTQ0MTg5ZjhhYmFkMGMyZWZhM2NhZTZhYWZhZTc2ZGFhYTdlYTQ2NjU1Y2MxMjkzNDg5ZmYifX19",
},
"Medium_Green": {
	"name": "Medium_Green",	"id": "0c711a43-7034-4c36-8126-972e9a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTg1ZmM5N2M3ZGYyNGE2YWE5YzBhYzg5ZmNiMjJiODE3MDBmNTk5ZjQ1YzMyYzdlMzE3OGI0NDQxNzJkZiJ9fX0=",
},
"Dark_Green": {
	"name": "Dark_Green",	"id": "b3ff2b89-e304-40c1-b210-471ccd",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWNmM2U0MjJiMzIyYjFlOTI0NWI0YjM2ODQzMzA0NWM3YjQzYzkwOWU1ZGQ2Yzc5MmU0YjZiZWRhNTQzMDNjIn19fQ==",
},
"Dark_Yellow": {
	"name": "Dark_Yellow",	"id": "58e8acf3-20df-4127-b3e3-d68076",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDQ1YjQ0ZmQxOWQ3MmZiM2Q2ZTE4OWM0OTc4YjFjYTY4N2RiZDY1ODBiMThkZGQ4YWE3MTBlZGZmYTUifX19",
},
"Yellow": {
	"name": "Yellow",	"id": "969fce41-6900-4877-8529-169ea6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTRjNDE0MWMxZWRmM2Y3ZTQxMjM2YmQ2NThjNWJjN2I1YWE3YWJmN2UyYTg1MmI2NDcyNTg4MThhY2Q3MGQ4In19fQ==",
},
"Light_Orange": {
	"name": "Light_Orange",	"id": "95dfc63f-0278-4f2e-8094-db1ecf",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDNjZGIxNmFiYjE3NTFkMWE0ODFlZDg3YjU3ZGIzYjg4M2U5OTYxZGEyZjlkNDg1YTI5ODY0ODdlMiJ9fX0=",
},
"Orange": {
	"name": "Orange",	"id": "95ffaa38-27ce-4b23-9a69-f4caaa",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmVhNTkwYjY4MTU4OWZiOWIwZTg2NjRlZTk0NWI0MWViMzg1MWZhZjY2YWFmNDg1MjVmYmExNjljMzQyNzAifX19",
},
"Light_Red": {
	"name": "Light_Red",	"id": "f1498cf1-42ff-42fe-83a9-5bab71",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGJhYzc3NTIwYjllZWU2NTA2OGVmMWNkOGFiZWFkYjAxM2I0ZGUzOTUzZmQyOWFjNjhlOTBlNDg2NjIyNyJ9fX0=",
},
"Red": {
	"name": "Red",	"id": "0738e42f-b6aa-4f22-a444-5717a6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTdjMWYxZWFkNGQ1MzFjYWE0YTViMGQ2OWVkYmNlMjlhZjc4OWEyNTUwZTVkZGJkMjM3NzViZTA1ZTJkZjJjNCJ9fX0=",
},
"Red_2": {
	"name": "Red_2",	"id": "27b2c930-daca-4574-a51b-df4f33",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2Y0NmMzMWQ2ZWU2ZWE2MTlmNzJlNzg1MjMyY2IwNDhhYjI3MDQ2MmRiMGNiMTQ1NDUxNDQzNjI1MWMxYSJ9fX0=",
},
"Dark_Red": {
	"name": "Dark_Red",	"id": "dadfc3b3-f981-47ab-851c-f14404",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTEwMTRlNGY0MWQ3NzI5OTI4ZjIxNTU1NWRhMmVhZjE1OGNlODNkOWUwYzk5NjFiZWY1ZWI3NjEzZDM3ZSJ9fX0=",
},
"Azure_Blue": {
	"name": "Azure_Blue",	"id": "2a83c29f-748a-4298-aa11-e5022f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2IxOWRjNGQ0Njc4ODJkYmNhMWI1YzM3NDY1ZjBjZmM3MGZmMWY4MjllY2Y0YTg2NTc5NmI4ZTVjMjgwOWEifX19",
},
"Cyan": {
	"name": "Cyan",	"id": "28408049-4255-46b8-936b-85bc87",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmMzNWY3MzA5OGQ1ZjViNDkyYWY4N2Q5YzU3ZmQ4ZGFhMWM4MmNmN2Y5YTdlYjljMzg0OTgxYmQ3NmRkOSJ9fX0=",
},
"Darkish_Blue": {
	"name": "Darkish_Blue",	"id": "79b607e4-be76-4e16-9d12-7cb7d3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjgzOWUzODFkOWZlZGFiNmY4YjU5Mzk2YTI3NjQyMzhkY2ViMmY3ZWVhODU2ZGM2ZmM0NDc2N2RhMzgyZjEifX19",
},
"Blue": {
	"name": "Blue",	"id": "0d2d7296-5e2e-409e-8d15-c01c82",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzk2NTQwY2U3NjIxMjVlMzk4Y2E1M2Q0Y2Q5YjY2ODM5NmQwNDY3ZTEyOGIzMGRhNWFhNjJiZTljZTA2MCJ9fX0=",
},
"Dark_Cyan": {
	"name": "Dark_Cyan",	"id": "fcd3e296-6099-4f47-8e86-021d30",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjc4NGMxNTJiZmMzZTJlMzEzZWYyM2ZjNDZkNDRmY2U0MWU0YWRhZDk0MjFiYWMyZGEzODk0NTExY2MwM2IifX19",
},
"Dark_Blue": {
	"name": "Dark_Blue",	"id": "c64e7996-3e23-48b5-b900-5af87b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTIzMDZhOTg3ODdlNTI2Y2U5NzNiZDU2MTI0ZTY0NWEyZTIzMjlkNTYzZGNmYTY4YTFiZTY1NzY3ZjI5YjUifX19",
},
"Purple": {
	"name": "Purple",	"id": "40939ac8-3abb-40b8-b059-b805db",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTkzNTJiY2FiZmMyN2VkYjQ0Y2ViNTFiMDQ3ODY1NDJmMjZhMjk5YTA1Mjk0NzUzNDYxODZlZTk0NzM4ZiJ9fX0=",
},
"Pink": {
	"name": "Pink",	"id": "6780703e-48af-4651-b0ff-e611b1",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODU1NjU0YjNmMWJmYjJjZGYwZjRiNTJkNjM2MGEwM2QzMWRkYWZjNzEwZjhhZmFlYTk5ZmJhNjY3ZTQ4MmRmIn19fQ==",
},
"Magenta": {
	"name": "Magenta",	"id": "309c9299-c87a-4b3f-9472-b5df45",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTEzM2ZhNTJkZDc0ZDcxMWU1Mzc0N2RhOTYzYjhhZGVjZjkyZGI5NDZiZTExM2I1NmMzOGIzZGMyNzBlZWIzIn19fQ==",
},
"Pink_2": {
	"name": "Pink_2",	"id": "2cd62dc9-9491-4dd5-8af0-b50eb7",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzU1N2RiNWYxNWNhNmYzNzAxOTAzY2NhNDAyY2U3N2VjNmY4ODUwMzZiNjgxMmU4Mjg4YWJkN2U5NCJ9fX0=",
},
"Pink_3": {
	"name": "Pink_3",	"id": "05df5069-4ee7-4069-a42c-77a107",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjA3MzI2ZDMxODU4ZWE1N2U3YmM1NWYzZTc1ZTZjODViMzRmZjRiZmQyODA4OGY5NGYxMWViOGUwZDFjZiJ9fX0=",
},
"Cream": {
	"name": "Cream",	"id": "afc2f4ae-3e05-43fc-846c-889431",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmY3NjI5NDAxMWNiZGNkMmU5Mjk0MWRhZmU2YjM3MjZkZmYwMmMzZTFmODRkZmE1N2M2YWJhYjZmYzMzY2U2In19fQ==",
},
"Mokka": {
	"name": "Mokka",	"id": "a2a9b5b9-da35-40b8-80ce-aee3df",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmFkNTk4M2RjYWJjOTMxYWI2YTQ5ZDJmYjg4NzllYmM1Mjk1Y2I1YmEyZjI3OGUzYzhhM2RhN2JjOGI0NzgifX19",
},
"Brown": {
	"name": "Brown",	"id": "db7c4d90-c6af-4227-9eb2-507b1c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDU3NGE0Njc3MzcyOTViZDlkZGM4MjU0NWExYTRlMTQ2YTk0M2QwNWVjYzgyMWY5Y2M2YTU0M2ZmZTk5MzRhIn19fQ==",
},
"White_Block": {
	"name": "White_Block",	"id": "47160e62-9eef-4c69-ab91-1ba1fa",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTVhNzcwZTdlNDRiM2ExZTZjM2I4M2E5N2ZmNjk5N2IxZjViMjY1NTBlOWQ3YWE1ZDUwMjFhMGMyYjZlZSJ9fX0=",
},
"Light_Grey": {
	"name": "Light_Grey",	"id": "bfef85fc-9c34-48f8-8b29-51c74e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzFjNDVhNTk1NTAxNDNhNDRlZDRlODdjZTI5NTVlNGExM2U5NGNkZmQ0YzY0ZGVlODgxZGZiNDhkZDkyZSJ9fX0=",
},
"Grey": {
	"name": "Grey",	"id": "9b7d4a9f-4dfe-43eb-a4d3-bd75db",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjJmMDg1YzZiM2NiMjI4ZTViYTgxZGY1NjJjNDc4Njc2MmYzYzI1NzEyN2U5NzI1Yzc3YjdmZDMwMWQzNyJ9fX0=",
},
"Black": {
	"name": "Black",	"id": "78bc0b40-5eba-474d-81c1-b0f6b8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWRkZWJiYjA2MmY2YTM4NWE5MWNhMDVmMThmNWMwYWNiZTMzZTJkMDZlZTllNzQxNmNlZjZlZTQzZGZlMmZiIn19fQ==",
},
"Candle": {
	"name": "Candle",	"id": "edd6c805-f813-4ef6-b3b0-569c8b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzgxMjI2NjU2ZDgyNTI5MWIxZDdlNDU2Yjc0ZWNkY2UyODY3MjE2OTY0MWU2YzM1YjFlMjNiOWI0MDI3NGUifX19",
},
"Wilson_-_Castaway": {
	"name": "Wilson_-_Castaway",	"id": "588104b8-7f0e-4575-8c51-6c51a2",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTk4ZDRmZTUxNzZhM2FjY2RlYmIxYzNmYjBiMjZjZjNhMTgxZmZmYzE2MGVhNTJhMDI4Y2I0MWYzNGNmZTEifX19",
},
"Potted_Rose_Plant": {
	"name": "Potted_Rose_Plant",	"id": "2d8ef167-5297-4aa4-adf5-5d1d36",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWRiYTM4ZTlmYzY3ZjcyYzQ1OGZkYWM4ZWNkN2NhYmFlZDNlYjgzNzM3MTQzYTAxMjgzNTBhMWFiMzgxZTNlIn19fQ==",
},
"Unlit_Candle": {
	"name": "Unlit_Candle",	"id": "95e5e32c-f380-4764-a69d-26e8d8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvN2FjYzYxNjY2YWRmMWU0Y2Q3Y2Y1N2FmM2UxZTE3YmExNzMxMGIyZmNkOGUzZWQyN2NmODhiN2QwZDg4NTE4In19fQ==",
},
"Police_Siren_2": {
	"name": "Police_Siren_2",	"id": "e8297346-5aca-4ae8-b2a3-e341b6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2EzNWFmYTU4NjMxNjA5NzkxZmZlMjVmM2E4NzlkZmJmZmVhMTE1MWY4N2JmZjYyYzU0MjNlZDYxMzZlZTAifX19",
},
"Mailbox_2": {
	"name": "Mailbox_2",	"id": "4113ced7-576b-4c03-8a92-0937d5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGFjYmJjYTU2NzM3MmE5YjJiMzZjOGY2ODE1NDg1MWJkYTVlZTFkNTNlMmJjMjA4YTExNTJkOWExOGQyY2IifX19",
},
"Skull": {
	"name": "Skull",	"id": "c659cdd4-e436-4977-a6a7-d5518e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWFlMzg1NWY5NTJjZDRhMDNjMTQ4YTk0NmUzZjgxMmE1OTU1YWQzNWNiY2I1MjYyN2VhNGFjZDQ3ZDMwODEifX19",
},
"Old_Books": {
	"name": "Old_Books",	"id": "b8200b13-4263-429b-95a6-1860e9",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTM0NGQ4M2U3YzZlY2U5MGQzNGM2ODVhOWEzMzg0ZjhlOGQwMTUxNjMzZmMyZWVhZTRkNGI2MzY4NjJkMzMifX19",
},
"Mossy_Stone_Brick": {
	"name": "Mossy_Stone_Brick",	"id": "354fd026-7162-4ca1-b14d-976347",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjc0OGVhNzA4MGFmY2RmMDdiMTUxMGZkY2U3Nzc2NjVhNzZhNmM2ZTJjMTY2ZDM5ZTFjMzQ1YTZiYjljNWYxZSJ9fX0=",
},
"Hydrated_Farmland": {
	"name": "Hydrated_Farmland",	"id": "407dd44c-95da-464a-991b-6cac1a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWE2NTY5MjZhZGNkNTA3ZmYwNzljZTQyZjUxNzc0MzVjMjhlZjM2OTM1OWNmN2NhNmY5ZDgyNWY1NzY3ZGIifX19",
},
"Prismarine": {
	"name": "Prismarine",	"id": "c591ceaa-f47a-40b6-b665-59b039",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTdlNTYxNDA2ODZlNDc2YWVmNTUyMGFjYmFiYzIzOTUzNWZmOTdlMjRiMTRkODdmNDk4MmYxMzY3NWMifX19",
},
"Enchantment_Table": {
	"name": "Enchantment_Table",	"id": "198765c1-c236-4c7d-8555-d0dbac",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTc2MmExNWIwNDY5MmEyZTRiM2ZiMzY2M2JkNGI3ODQzNGRjZTE3MzJiOGViMWM3YTlmN2MwZmJmNmYifX19",
},
"Clownfish": {
	"name": "Clownfish",	"id": "7b314fba-09ab-4ab6-b956-cec6a5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzZkMTQ5ZTRkNDk5OTI5NjcyZTI3Njg5NDllNjQ3Nzk1OWMyMWU2NTI1NDYxM2IzMjdiNTM4ZGYxZTRkZiJ9fX0=",
},
"Bird": {
	"name": "Bird",	"id": "db5caefc-65bd-484b-b1ff-24ccc4",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjk2MjczNzBmZWRiZDBiYWU3YmFlNmQ2Zjg1ODM1NTU3NjM3ODljMWJkOTNmYTYzOWNmYTNkZmQ0OGUzNDg1MCJ9fX0=",
},
"Ham": {
	"name": "Ham",	"id": "25c79e23-1569-4951-ad97-22b6a2",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjYzMzZmNWJiOTk3NWJmNTdlMTRkYjY2MTVjMTg5NmM1YzRiOWMzOWFhZDE3YjE3ZTRlZTIwYjIzMWNmNiJ9fX0=",
},
"Potted_Salvia_Plant": {
	"name": "Potted_Salvia_Plant",	"id": "4e49245d-0ac2-4c6e-aff8-2894c8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWQ4MGMyNmY5MDRiNTdlNjMxZTM5ZWJjNDQ2ZWMxYWYyZGNlMzQzMmViODQzMWZiZDE5MDg3YWRiNGFiY2IifX19",
},
"Potted_Daffodil_Plant": {
	"name": "Potted_Daffodil_Plant",	"id": "e0234bf4-a604-4c14-a2cb-342cb8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjNmZmZjODk1NWIwZTgzMDI4OThmN2YwMTVkODQ5ZjBhMDFkYmJiMDQyNzQxNzUwNmZiODllYWQ1NGQ0NWY2In19fQ==",
},
"Potted_Camellia_Plant": {
	"name": "Potted_Camellia_Plant",	"id": "e5fdfdc7-f8a4-4a77-8d7c-17d98c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWRjNGMxMmJmMjYxOWNiZmM4ZjIyZGM2MmMwMjJjZTE1MTI2Y2VhM2UyMTJjMjhkOWY5NmVhMzEwYWM0YzQyIn19fQ==",
},
"Potted_Azalea_Plant": {
	"name": "Potted_Azalea_Plant",	"id": "faec9b66-94ca-4b6f-b6cd-f9a54b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzM1MjU3Yjc5OWQzOTQ2OTI3ZjJiMzI1ZDM2NmViNTEwNGE1YzM1MjE5ZWU0ZTRkMzU3MjFiZjI4YTIxMCJ9fX0=",
},
"Clock_2": {
	"name": "Clock_2",	"id": "e8ec3c51-e0e5-4f6f-b8ad-7ca163",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGE2YWU1YjM0YzRmNzlhNWY5ZWQ2Y2NjMzNiYzk4MWZjNDBhY2YyYmZjZDk1MjI2NjRmZTFjNTI0ZDJlYjAifX19",
},
"Cocoa_Pod": {
	"name": "Cocoa_Pod",	"id": "226f1ae5-09c3-4af3-8754-9d69b3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTA4M2VjMmIwMWRjMGZlZTc5YWEzMjE4OGQ5NDI5YWNjNjhlY2Y3MTQwOGRjYTA0YWFhYjUzYWQ4YmVhMCJ9fX0=",
},
"Command_Block": {
	"name": "Command_Block",	"id": "595bff7c-c03f-4af8-b573-61f4b1",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODUxNGQyMjViMjYyZDg0N2M3ZTU1N2I0NzQzMjdkY2VmNzU4YzJjNTg4MmU0MWVlNmQ4YzVlOWNkM2JjOTE0In19fQ==",
},
"Hay_Bale": {
	"name": "Hay_Bale",	"id": "146ab9e1-1ddc-4eca-ac95-61e205",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGUzY2E1YjM5MGQxZTVmMjk3MjgzMjU3Y2U5MGFjNmY4NzgzZDc4NmVjYWVlMDk1YjQ5Y2M2Yjk0NGQ3MmQifX19",
},
"Hay_Bale_2": {
	"name": "Hay_Bale_2",	"id": "b4fa9287-d6a7-4faf-9a82-3088c8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTFhYzVjNGVmNzUwMWFiMWViOWEyNzg5YWQ2ZTY1YWNkZjZhMjczMThkOGRlNTM1NmZlMjQ3NTE3M2E2MThmIn19fQ==",
},
"Glowstone": {
	"name": "Glowstone",	"id": "7066e559-9f4b-4c7b-a36e-52f5bc",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjVkN2JlZDhkZjcxNGNlYTA2M2U0NTdiYTVlODc5MzExNDFkZTI5M2RkMWQ5YjkxNDZiMGY1YWIzODM4NjYifX19",
},
"Gravel": {
	"name": "Gravel",	"id": "c02b21a2-8e9b-4f27-928a-fea86a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjMyYTFhNTBiYmU0MzFkYzJmZjcxZThiMjZiYjZkZWExNTVmNzJlMmY0NjlkZGExNGYxMDhjNjA4M2E3ZWNkYSJ9fX0=",
},
"Missing_Texture": {
	"name": "Missing_Texture",	"id": "5d43c6dd-ca01-466c-9614-764449",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTllYjlkYTI2Y2YyZDMzNDEzOTdhN2Y0OTEzYmEzZDM3ZDFhZDEwZWFlMzBhYjI1ZmEzOWNlYjg0YmMifX19",
},
"Mushroom_Stew": {
	"name": "Mushroom_Stew",	"id": "e38a4b23-e498-4c8e-8415-ca0b31",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2MxNDE0NGY2MWM0ZTY2YjNjNDQzNjYwZGViYzczY2IyMTI1ZDAxNDBjNTFiNTUyMmM4YTY4Yjc4OTQxNCJ9fX0=",
},
"Sweet_Roll": {
	"name": "Sweet_Roll",	"id": "25fef6eb-d5a6-4f3b-a064-47770d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWM2ZWI4ZjE1YmEwZDc5OTNiZjg3MDhmYTFkZDg2YzFlOGZkZTc0MWE3ZGRlOTE5NWYyMjg5MWUwMjE1MyJ9fX0=",
},
"Ice_Cream": {
	"name": "Ice_Cream",	"id": "e519ad2c-9aa1-4390-a93c-a24574",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDhlM2I1M2JjOGZhYjE5YzZmZDBmOGFiZjEzYmYyMzAzNTgxZDgxNjkxMTQxZjE1OTczYjQ3NzdlMDM5ZjczIn19fQ==",
},
"Portal_Core_-_Wheatley": {
	"name": "Portal_Core_-_Wheatley",	"id": "2bfae29c-a956-4064-84ce-b37784",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjY4NGY0YTZlZDE0Mjg2NWRiMDkzOGU0ODc2NzY4NDlhNTRkNjQzNzhlMmU5ZTdmNzEzYjliMWU5ZDA0MSJ9fX0=",
},
"Great_Ball": {
	"name": "Great_Ball",	"id": "216a2090-9346-4eda-97ee-7d1bb9",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWNmYWY2MTAyNzVmNDMzYTM0ZTUzMTc1NzNjZTFmOWEwZjY2N2NlMTBjZGYxZDA2YzllYmE1ZDljYjU3MDQ3In19fQ==",
},
"Ultra_Ball": {
	"name": "Ultra_Ball",	"id": "5168c712-e29d-4f55-a241-6b0d9c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2Q4NWM5NmVmYWVmZWYxMWExYTM1YjExN2NhMmYyMzFjNjk2ZTRlNjkzYjczYTFiYWU3NzIyMTYwNzAxMWUifX19",
},
"Master_Ball": {
	"name": "Master_Ball",	"id": "fd80eed9-c531-4daa-94ae-699b06",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTg3OWU2NGZkMmUyZDE1ZDFiN2U0N2FlNDBmYTUyOGZjNzIwODZhMzEyZDZhNmVkM2Y3ZTU1MmFmOWQ1In19fQ==",
},
"Green_Ore": {
	"name": "Green_Ore",	"id": "8e9697d5-a5c9-4f9c-9b6e-041c91",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNThjMjA2ZTI5OTI0Yjk5MTZkNGQyNGRmYmJjMzhmMjhiNDRkNmQzY2ZhMjNhZGVjOWVkM2E4ZmNlMWI3YjIifX19",
},
"Cactusflower": {
	"name": "Cactusflower",	"id": "38c10950-d294-45de-b5e5-0f6e17",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTA0ZjFhNTU5NDNjNTk0ZTcxMTllODg0YzVkYTJhMmJjYThlN2U2NTE2YTA2NDlhYTdlNTU2NThlMGU5In19fQ==",
},
"Molten_Core": {
	"name": "Molten_Core",	"id": "bd584864-2c12-43f6-b537-d933cf",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWJiMjhiYjBiZjFhZDIxN2QyYTgxMTkxZWZmY2M2OWZlMTc0NzE0YTQzMmZkNzFmYTYwYWE1MGYzNzEyYjk3In19fQ==",
},
"Basketball": {
	"name": "Basketball",	"id": "f2f775e7-c634-4d64-8b89-a3d14d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWRmODQ3MTVhNjRkYzQ1NTg2ZjdhNjA3OWY4ZTQ5YTk0NzdjMGZlOTY1ODliNGNmZDcxY2JhMzIyNTRhYzgifX19",
},
"Reddit": {
	"name": "Reddit",	"id": "4e5da33e-189b-4ea7-9d17-508f8a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGQ5YmQ0YjJmYThkYTgyNDdhODJjM2QxZmEyNDY3MTVmOWI2ZDk4Yzc3ODM3NGRhNmVmYzEwYzg5Y2Q2NCJ9fX0=",
},
"Gold_Steve_Head": {
	"name": "Gold_Steve_Head",	"id": "844064fd-71f0-4aa2-a336-10bbada597d1",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjkzN2UxYzQ1YmI4ZGEyOWIyYzU2NGRkOWE3ZGE3ODBkZDJmZTU0NDY4YTVkZmI0MTEzYjRmZjY1OGYwNDNlMSJ9fX0=",
},
"Diamond_Steve_Head": {
	"name": "Diamond_Steve_Head",	"id": "df9697d6-a5ce-4b78-acf7-a4b8b0b74066",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTBiOGViMzMzNjIyYWU3ZGU5YjUzYjM2MDJmNDFmNjNkYjljMjUyOGI1YmUyMzFhYzk2NTE2NjExZmIxYSJ9fX0=",
},
"Computer_5": {
	"name": "Computer_5",	"id": "39140167-d278-419a-977c-57337e2e115c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWNjZWZkNWYyYTk0ZjI0MjgxOTg1OGE5NjU1NWExM2JhZWJhOWRhZThkNDY3ZjQwNjE5NzRlZTk5OWI2OTU5YiJ9fX0=",
},
"White_Vase": {
	"name": "White_Vase",	"id": "5f2c3ed5-919f-4b7b-9168-77312885a773",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWQ3YWQxYjFkYjJiMzIzZjAxM2I3NzVhOGY5NDgxZjFjZDI5MmJmOWE1OGRkMjkwNWUzZTE5MjlkMTNiYWMifX19",
},
"Brown_Vase": {
	"name": "Brown_Vase",	"id": "1c78d02a-2326-4989-bcb7-89fc320cae4a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2E3NjY3NGM2Y2VjNmYzMWJmZWZlMDQ4M2RkYWVhYWQyMzg2ZjAyYzM1ODdmMDU1ZWFiOTFlNDRjYTdiNCJ9fX0=",
},
"Pink_Vase": {
	"name": "Pink_Vase",	"id": "ee47b739-3a72-4ef1-9ae9-83b8768e4622",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2M2YzFkODU0ODVlYTU2N2E1MzZkMmJiMzNkYWQ4ZmQ2ZGMzMWYxZjc0NDY3ZTdjMTdkOGQ3NWEzZDU3In19fQ==",
},
"Blue_Vase": {
	"name": "Blue_Vase",	"id": "338fe814-9129-4023-a901-45df208bfed5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTU4NDdiNWQxNTlhMmQwYTFkNzNhMmM4YmY4ZDllYWYxMzRmNGE2ODU0MTc2YWNlN2Q4MTk0ZmY3ODJmMjFmIn19fQ==",
},
"Masterchief_-_Halo": {
	"name": "Masterchief_-_Halo",	"id": "121b724e-9b29-4321-9286-1ab3f0881dd8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjc3NWExN2MyOTQxYWU2YTJhNWYxODQwNTA5YjlhYjBjMGQ5Njg1OWE5YmMyNDk3OThiODZmMTk1MmIwODMyZSJ9fX0=",
},
"Yoshi": {
	"name": "Yoshi",	"id": "91318ba0-ec9d-4072-95a7-fca5d39bd2dc",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjcxZWJjMTFiZGQxNTE0MTBkYTcwZDkzMTI1OWM0ZTk2OTUyOGU2ZjU4ODllOWM0YmIyZGQ3NjNiOWVhZmQifX19",
},
"Batman": {
	"name": "Batman",	"id": "af20c020-6810-4abe-8437-97d3bff52bec",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjI1NmY3MTczNWVmNDU4NTgxYzlkYWNmMzk0MTg1ZWVkOWIzM2NiNmVjNWNkNTk0YTU3MTUzYThiNTY2NTYwIn19fQ==",
},
"Computer_6": {
	"name": "Computer_6",	"id": "35154f7d-0e43-4b65-80b2-13dca69b0626",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmVkNGFlNzU3ZjIzNDQ1YjVjOTMzNWNjNWE4ZjdmN2M2ZjlhNWFlZTg1YmI2OWZlOTdmNTgxZGFmYjE4ZDMwIn19fQ==",
},
"Luigi": {
	"name": "Luigi",	"id": "3731f0dd-5c62-4f55-b894-4a1d9357b3ae",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmYxNTMzODcxZTQ5ZGRhYjhmMWNhODJlZGIxMTUzYTVlMmVkMzc2NGZkMWNlMDI5YmY4MjlmNGIzY2FhYzMifX19",
},
"Mario": {
	"name": "Mario",	"id": "318f8053-5ddd-4544-b67b-d48010fe72fb",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGJhOGQ4ZTUzZDhhNWE3NTc3MGI2MmNjZTczZGI2YmFiNzAxY2MzZGU0YTliNjU0ZDIxM2Q1NGFmOTYxNSJ9fX0=",
},
"Lemon": {
	"name": "Lemon",	"id": "8c381719-b7cc-47ab-91d4-b125235cee7d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTU3ZmQ1NmNhMTU5Nzg3NzkzMjRkZjUxOTM1NGI2NjM5YThkOWJjMTE5MmM3YzNkZTkyNWEzMjliYWVmNmMifX19",
},
"Plum": {
	"name": "Plum",	"id": "f4f1a6e2-363a-4f7b-83e7-07f861c604a9",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWNjMDE2ZjU2OGQxNDMzODYwZDgyZmEzMzc5ZDc4NGNiYmQ1MmU1NmI1NWY3OGJlNzI5MWY4NjE4ZGEzOGM4In19fQ==",
},
"Salad": {
	"name": "Salad",	"id": "ca21f44a-ab17-43f1-a5e9-f3238e696490",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWZlOTJlMTFhNjdiNTY5MzU0NDZhMjE0Y2FhMzcyM2QyOWU2ZGI1NmM1NWZhOGQ0MzE3OWE4YTMxNzZjNmMxIn19fQ==",
},
"Bee": {
	"name": "Bee",	"id": "bc1ca880-4dc5-4d17-9c05-027a7d3999b3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTQ3MzIyZjgzMWUzYzE2OGNmYmQzZTI4ZmU5MjUxNDRiMjYxZTc5ZWIzOWM3NzEzNDlmYWM1NWE4MTI2NDczIn19fQ==",
},
"Granite": {
	"name": "Granite",	"id": "e26d2b6c-c6ed-408c-bb98-b915920d20ba",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTAyODViZWEzYzhhMDJkYjEzOWZhOGVjNWNjNTg4NjE1YTk4NTUwNzI1ZjhlNjc2YzkzZmRiYzMzYjZiIn19fQ==",
},
"Polished_Granite": {
	"name": "Polished_Granite",	"id": "35e5aaca-99d4-41c8-8a09-25a9f36e6710",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWFlNGNmMjJmNDViYjc3YWVmYTVhZmExZjg2NGRkM2M1ZjlkM2U5MmY0M2IzNTg4ZmQxNjJiMmFhOGMifX19",
},
"Diorite": {
	"name": "Diorite",	"id": "b5929fcf-c955-4052-9535-83df5e3a8cb8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTNmYTUyNjVhMzM2YWJkZTMwMWE5ZDU5YWY0NzgzZTgyYTEwZGFkMDgxNzcxNmVhZDI5NjJhYjdjNmQzZGZmIn19fQ==",
},
"Polished_Diorite": {
	"name": "Polished_Diorite",	"id": "d950d18e-a3b6-48ce-97e5-00fef277ea9f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzFhMjgxZjQ5NDUyODZjMzFmYTA3NzEyMWY5YjMyYzU4OGZiOTQwNjRkZTdmOTA4Y2YwZTk2NzdjZGRhOGIxIn19fQ==",
},
"Andesite": {
	"name": "Andesite",	"id": "a1ec9574-4ecb-4cdf-a2f5-74d113663fba",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjUxMzU0M2E3NzExOGY4MjAxZjQ5YjdjOGI2MzJkY2ZkMzgwMzdlYmZjNjAxYTFiYzkxYWVkYzRjYWJhIn19fQ==",
},
"Polished_Andesite": {
	"name": "Polished_Andesite",	"id": "9bbb161b-b46f-4582-8ca6-d736606dc019",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2E5NzlmNzY2MzNmNWRkYTg5NDk2NTExNzE2OTQ4ZTlkN2I4NTkyZjZlMWU0ODBjNWRlMWM4MzIzOGQzZTMyIn19fQ==",
},
"Acacia_Planks": {
	"name": "Acacia_Planks",	"id": "7176f804-1cd3-4fa9-b285-dbfa2d8d59bc",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjI5OTY0ZGU4OGJjYWIzZjFiNzYzNTUyYjc5OTExZWYyNGU3NWIzMzUyZjY1ZGJkYThmNThmNjFkMWVhN2YifX19",
},
"Dark_Oak_Planks": {
	"name": "Dark_Oak_Planks",	"id": "501e0826-366f-4caf-b866-f6273a853d61",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGZkOTE3ZmQ1OTNhN2FjNWJkZmUxZmM2NWQzMjBkZjQ2MTFkYTQzMWYzZWE0ZjM0YzdhMTkwMjBmNTEyIn19fQ==",
},
"Birch_Planks": {
	"name": "Birch_Planks",	"id": "3e6c5dae-e682-44a9-8709-3e1b42309603",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjQyNzRhY2Y5NDYzNWE4NzNkZjA5Njg4MmEyNjYxZGNkNDQzMjgyZGIwODg4MGM3NjU1OTQ3YzRjYzY1ZCJ9fX0=",
},
"Jungle_Planks": {
	"name": "Jungle_Planks",	"id": "b54304fa-5a01-4453-9903-4d4b5806b4e0",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmQ5ZGQ3ZTU1ZWNiMDI1ZjdmNmNhYTc5OWU0YjBhMGM1NDg2MDk3YTU3N2Q2M2ZmMjIyYmYzMzhmNWViMCJ9fX0=",
},
"Spruce_Planks": {
	"name": "Spruce_Planks",	"id": "dc0540a2-e511-4e0c-b513-3020b20e8a70",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTBlYjE5NjhmZjJkYTZiY2E2OGY1OWI2MTExNzEzZTA4ZDIyNDk5MjI5ZTEwODY0NDljYmE1MGY3ZGU2NGFlIn19fQ==",
},
"Spruce_Log": {
	"name": "Spruce_Log",	"id": "22467c15-347b-409a-8ef2-50451e582dd4",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTE5YWU2MWQ4NjJlNGI0ZGM5NWQ1ZTZlNjA1NjRlZTQ0NmNkNGMzOWUwMTUyOWEwNDMxMDJiMzE4NGM3ZDg4In19fQ==",
},
"Wet_Sponge": {
	"name": "Wet_Sponge",	"id": "f64f39ec-4154-4067-8530-c21f848b8fcc",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzI4YmRkMzQ4MTBmODY2NTI3ZGFhZjI4M2RhNzE4MjZhODM3ODI4NmIyYTQzYTYyNjYxNWZhMWIzNjM5ZSJ9fX0=",
},
"Lapis_Lazuli_Block": {
	"name": "Lapis_Lazuli_Block",	"id": "1cbc5f90-4877-47ec-8912-77a3b2314239",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmQ4NDhkYzZmNjk0Y2JmMzU0NDE3MjJiMWEyN2ExOTVkYTU2ZTQ5NjAyMzE4MjRmZDdlYzViMTMxNWNjMmEifX19",
},
"Lapis_Lazuli_Ore": {
	"name": "Lapis_Lazuli_Ore",	"id": "65818039-794b-4d66-8912-a4ff5dc4f5ba",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmFhMGQwZmVhMWFmYWVlMzM0Y2FiNGQyOWQ4Njk2NTJmNTU2M2M2MzUyNTNjMGNiZWQ3OTdlZDNjZjU3ZGUwIn19fQ==",
},
"Sandstone": {
	"name": "Sandstone",	"id": "b425c1fa-fca6-4b88-8857-85152fef9628",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2YzODExN2MxNTdmMmNjZTI3ZjU2NmZiNjI0MmRkY2MzNGRhYmMzOWNkZDFkNTRlNjYxMjhhNGVjOGEzY2E0YyJ9fX0=",
},
"Smooth_Sandstone": {
	"name": "Smooth_Sandstone",	"id": "5ce04174-74a9-424a-aaf6-8ba4dfd1b529",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDM2ZTk4NjI4MzJhNmZjYzQ4NTVmYTc5YzFhYWU1ZTczYjkxOTdlYzZiYmQzOGY2MzEyZWZhYzY4MGM2MzI4NSJ9fX0=",
},
"Solved_Rubiks_Cube": {
	"name": "Solved_Rubiks_Cube",	"id": "363ab37e-373e-47a2-ad5d-e44d3803f853",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGYxYTI3N2JlYjllNGZhYTZlN2UzNTZjNzQ3ODZlOTY2MTU1NzM2YTY4NThiZjViYjVhZDI5ZGY1YmFiNjFhMSJ9fX0=",
},
"Scrambled_Rubiks_Cube": {
	"name": "Scrambled_Rubiks_Cube",	"id": "68f87a44-275f-4a5d-986a-6f41d405c72e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWQ4NmU3YmQyOGMxNDZmNzE1MTRjNzgyY2FjMDU1ODYwZDFmMzcyYjRhOWJlM2ZlNjVjZmUxMTA0NzMzYmEifX19",
},
"Black_Wool": {
	"name": "Black_Wool",	"id": "b82be7d6-b59a-4579-b332-be7288bbc2d5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2FiMDI2M2JkZDc2ZjNlNDE4ZGJhNWJmNDgxYjkyMWNlZDM5N2Q4YjhhMzRhNTU2MWZiN2JlYWE0NmVjZTEifX19",
},
"Blue_Wool": {
	"name": "Blue_Wool",	"id": "8d9ca4f6-21c6-420a-8c63-a0beff448a72",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2YzZTQwNjI5MTE3NGQyNGNkZjBmOTUzZjhhMTc0YTgyYmIzNDg5ZGNlOGY2NzlhNDQzZWYxYWFlMDE2OTA2MSJ9fX0=",
},
"Brown_Wool": {
	"name": "Brown_Wool",	"id": "7272b1c1-dbc8-4533-801a-86164118a749",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzJlMzZmNmE2NTRkZTc0NTgzZDgwMzAxNzdhZDZlM2FjNjc1NWQ3NDM1ZDkxMjNlOGViZGZmNzRiMmQ5MGNiIn19fQ==",
},
"Cyan_Wool": {
	"name": "Cyan_Wool",	"id": "f38918d1-3288-4099-9b8a-3b884c257da0",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODhlZmFkNzRiMjU0ZTU3Yzc5OTc2M2RjZWVlNDUxMWZhMmY4NWFlOWZhNTU2ZWFhOTdkNDViZjY3ZTBiNmIzIn19fQ==",
},
"Gray_Wool": {
	"name": "Gray_Wool",	"id": "14774a24-c457-4bff-94eb-01ace70604a0",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTllNjkxN2YyZmI0ZWEwOGU3MTMyZGYzMDk2MWQyYjVjNTIzYWJiYTE5Y2U0M2Y4MzVmYzE0YzU2OGY0In19fQ==",
},
"Green_Wool": {
	"name": "Green_Wool",	"id": "703f9cf1-9aec-4f93-b7c3-c7d5975a6358",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDg0Njg0MzQ0YWUwOTg1MjlmYzk0MWFhODRlMTk1YmRjYTM3NDhkNjlhY2ZlZTJiYWMxMzMyMTM1ZWRkOThjIn19fQ==",
},
"Light_Blue_Wool": {
	"name": "Light_Blue_Wool",	"id": "d0a7287f-97fe-4aae-92fd-8b3ddcf22eff",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjFhZjQ2ZmViZDQ1YzBmNGQ4MWU4ZmExYjY2YjI3NWQ4OWUyNzJiMmFkNTVjOTc4NTUzYTk5YzczM2UxZmYifX19",
},
"Lime_Wool": {
	"name": "Lime_Wool",	"id": "2607854d-07bb-4a1f-bd92-f43a52423450",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDY3NDcwYTBjMThmNjg1MWU5MTQzNTM3MTllNzk1ODc3ZDI5YjMyNTJmN2U2YmQ0YTFiODY1NzY1YmQ3NGZlYiJ9fX0=",
},
"Magenta_Wool": {
	"name": "Magenta_Wool",	"id": "9cc84482-5e9b-46af-8c64-eae003206a8f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWJiNDM4NmJjZGE4NGUzNTNjMzFkNzc4ZDNiMTFiY2QyNmZlYTQ5NGRkNjM0OTZiOGE4MmM3Yzc4YTRhZCJ9fX0=",
},
"Orange_Wool": {
	"name": "Orange_Wool",	"id": "aa2d1287-7fb9-4a35-8448-1acbacc1bb8b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2JmNzc5N2EyNGE2YWY4NzVmNWM4MjcxYzViOGM0MjVlMTlmMzcyYTQxNWUwNTUyZmMyNDc3NjNmMjg1OWQxIn19fQ==",
},
"Pink_Wool": {
	"name": "Pink_Wool",	"id": "e18ea167-b6e0-420a-a5b4-e881c318af70",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmJlY2ZiMzg3OTkzNmI4OTllNDIwYmZjZDNhNzRmOGExYmY5ZGQ1NGM1OGVjN2ZiOWY4MWQ5YTVkOTg4ZSJ9fX0=",
},
"Purple_Wool": {
	"name": "Purple_Wool",	"id": "1b995bdd-4fdc-4430-bf5a-a4e61dd55b7f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmE5NGNiMjVkZTYyOGNhMzU5YjJmNmVhNWE4ODY4Y2JlMjY1OTVlZWRiMmJmZmI3NTA5NjdhZDFlZTE4NTAifX19",
},
"Red_Wool": {
	"name": "Red_Wool",	"id": "9caf209b-f29f-4b43-bc37-6fbf9bb93934",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODZkMzVhOTYzZDU5ODc4OTRiNmJjMjE0ZTMyOGIzOWNkMjM4MjQyNmZmOWM4ZTA4MmIwYjZhNmUwNDRkM2EzIn19fQ==",
},
"Light_Gray_Wool": {
	"name": "Light_Gray_Wool",	"id": "f6fef3dc-5243-483d-94e2-393ecbeb6417",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTk4YmEyYjM3NGNmYzg5NDU0YzFiOGMzMmRiNDU4YTI3MDY3NTQzOWE0OTU0OTZjOTY3NzFjOTg5MTE2MTYyIn19fQ==",
},
"White_Wool": {
	"name": "White_Wool",	"id": "9c98db90-85c0-4ef7-8cd7-793091dbc136",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2ZhZjRjMjlmMWU3NDA1ZjQ2ODBjNWMyYjAzZWY5Mzg0ZjFhZWNmZTI5ODZhZDUwMTM4YzYwNWZlZmZmMmYxNSJ9fX0=",
},
"Yellow_Wool": {
	"name": "Yellow_Wool",	"id": "164f9d3e-cdb6-414a-bfa0-a5c1729483b5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjdiYmQwYjI5MTFjOTZiNWQ4N2IyZGY3NjY5MWE1MWI4YjEyYzZmZWZkNTIzMTQ2ZDhhYzVlZjFiOGVlIn19fQ==",
},
"Cracked_Stone_Brick": {
	"name": "Cracked_Stone_Brick",	"id": "b0edeefd-dafd-4c11-a6df-ce135be6ddf6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzlhNDZiMmFiMzJmMjE2ZTJkOTIyYzcyMzdiYTIzMTlmOTFiNzFmYTI0ZmU0NTFhZDJjYTgxNDIzZWEzYzgifX19",
},
"Mossy_Stone_Brick_2": {
	"name": "Mossy_Stone_Brick_2",	"id": "a1a60dd2-d7af-4450-9ef6-f4280c733e7d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzIzNzMzMzMzOWNiYzZiNDY5NDUyYzk2MjExZmEyM2UxOTUxZTg3OTUwNzZmOWVlZDk2YTEzODI0YTg3OSJ9fX0=",
},
"Stone_Slab": {
	"name": "Stone_Slab",	"id": "8d1afea0-0ce4-46de-bd8e-d41963eb8dec",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGRkMGNkMTU4YzJiYjY2MTg2NTBlMzk1NGIyZDI5MjM3ZjViNGMwZGRjN2QyNThlMTczODBhYjY5NzlmMDcxIn19fQ==",
},
"Snow_Block": {
	"name": "Snow_Block",	"id": "b1b51324-5760-47f0-a1ba-1bae05f0b761",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWRkNmZlMjY3YTQxOGRjYzdmMzdhOGY3Njg1NWI1MzI4YjEzMDM4OTdiMzQyYTEwN2NmMTYyZjE0ZmUzZCJ9fX0=",
},
"Slime_Block": {
	"name": "Slime_Block",	"id": "ba891286-acc2-4583-a596-7fa90743e30e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTBlNjVlNmU1MTEzYTUxODdkYWQ0NmRmYWQzZDNiZjg1ZThlZjgwN2Y4MmFhYzIyOGE1OWM0YTk1ZDZmNmEifX19",
},
"Obsidian": {
	"name": "Obsidian",	"id": "4871fc40-b2c7-431d-9eb8-b54cd666dca7",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzg0MGI4N2Q1MjI3MWQyYTc1NWRlZGM4Mjg3N2UwZWQzZGY2N2RjYzQyZWE0NzllYzE0NjE3NmIwMjc3OWE1In19fQ==",
},
"Smooth_Red_Sandstone": {
	"name": "Smooth_Red_Sandstone",	"id": "7a8dae9e-559a-46aa-97db-d38f677d4985",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTJkYTdhYTFhZTZjYzlkNmMzNmMxOGE0NjBkMjM5ODE2MmVkYzIyMDdmZGZjOWUyOGE3YmY4NGQ3NDQxYjhhMiJ9fX0=",
},
"Red_Sandstone": {
	"name": "Red_Sandstone",	"id": "d14c8c76-e14e-4387-be6f-a363b36ec146",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGIzMWJlMTk3YWM3ZDc4YjMwYzM0ZGFjMjY2NWRiZjFhNzRmOTZhNzllNTJjYjhlZDUwODhhZDcwZWU5MzQ4In19fQ==",
},
"Note_Block": {
	"name": "Note_Block",	"id": "fb585583-8345-4af5-8687-dcb6f064b63b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGNlZWI3N2Q0ZDI1NzI0YTljYWYyYzdjZGYyZDg4Mzk5YjE0MTdjNmI5ZmY1MjEzNjU5YjY1M2JlNDM3NmUzIn19fQ==",
},
"Mushroom_Stem": {
	"name": "Mushroom_Stem",	"id": "1d76cb23-a722-4247-97f9-450b140489a5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjU1ZmE2NDJkNWViY2JhMmM1MjQ2ZmU2NDk5YjFjNGY2ODAzYzEwZjE0ZjUyOTljOGU1OTgxOWQ1ZGMifX19",
},
"Packed_Ice_Block": {
	"name": "Packed_Ice_Block",	"id": "39c4559e-8a9c-40ca-9b32-4420c478b445",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTZhYWI1OGZhMDFmY2U5YWY0NjllZDc0N2FlZDgxMWQ3YmExOGM0NzZmNWE3ZjkwODhlMTI5YzMxYjQ1ZjMifX19",
},
"Furnace": {
	"name": "Furnace",	"id": "40c7eaa9-dba8-4eee-ac32-5308877bb29f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGZkOWIyZjQyZDVmMWMyYTc3YjUxMWZlNDFhNGM2YjVjMTkyZmIxMGIyY2VhZGRlMDViZDFhZjUyYTE1MSJ9fX0=",
},
"Nether_Portal": {
	"name": "Nether_Portal",	"id": "ae1e7567-0b38-4677-97ae-e3fd99d39fbf",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjBiZmMyNTc3ZjZlMjZjNmM2ZjczNjVjMmM0MDc2YmNjZWU2NTMxMjQ5ODkzODJjZTkzYmNhNGZjOWUzOWIifX19",
},
"End_Stone": {
	"name": "End_Stone",	"id": "88ad360e-72bc-48a5-9ad1-8acdc717cda7",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTlmMjFmNWQ4ODMzMTZmZDY1YTkzNjZmMzJhMzMwMTMxODJlMzM4MWRlYzIxYzE3Yzc4MzU1ZDliZjRmMCJ9fX0=",
},
"Mossy_Cobblestone": {
	"name": "Mossy_Cobblestone",	"id": "32289766-a220-44e6-9076-1283a6c53528",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGQ5MjM4ZWZjOTM0OTNiMTRhNTgyNjM5ZWIwYWE4ODM0ZWFhNDhlMTBiZDRjMjM0ZWIxYTRjMzYzYjQzZDViIn19fQ==",
},
"Brick_2": {
	"name": "Brick_2",	"id": "db127873-1a45-412d-83e8-5cbc31de58fe",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWVjMGViZWExODIxYzI5MmZkZmY0NWQzNTliM2E5ZTIxMjI3MTdlODNkNTVkYzA3ZmMzYmIxY2UzMjkzNWUifX19",
},
"Clay": {
	"name": "Clay",	"id": "d168a3ce-0b99-4eb0-b3cd-4216189e4008",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjc4MjY4MjllYWI1YWQ2MmYwYzExZDlmYWFmZGM5OTU0MzY0ODcxMTYwZGQ4MzllMWFiNWEzYjIxM2EzMyJ9fX0=",
},
"Coal_Ore": {
	"name": "Coal_Ore",	"id": "6e26d558-9b39-4a63-ab0d-cc0fef72b078",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzc4OGY1ZGRhZjUyYzU4NDIyODdiOTQyN2E3NGRhYzhmMDkxOWViMmZkYjFiNTEzNjVhYjI1ZWIzOTJjNDcifX19",
},
"Coal_Block": {
	"name": "Coal_Block",	"id": "c7b9f611-64c6-4e9c-ac97-8dedf8b97e17",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjZjNWVjYWM5NDJjNzdiOTVhYjQ2MjBkZjViODVlMzgwNjRjOTc0ZjljNWM1NzZiODQzNjIyODA2YTQ1NTcifX19",
},
"Cocoa_Bean": {
	"name": "Cocoa_Bean",	"id": "226f1ae5-09c3-4af3-8754-9d69b3bd18aa",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTA4M2VjMmIwMWRjMGZlZTc5YWEzMjE4OGQ5NDI5YWNjNjhlY2Y3MTQwOGRjYTA0YWFhYjUzYWQ4YmVhMCJ9fX0=",
},
"Dispenser": {
	"name": "Dispenser",	"id": "c08f9311-628e-4937-a9c6-b7d416d4a2f5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTgyZTZhYTk1MDExNzM4NGViNGJmNTUyMTcyODNhNzhmNTdiOGM4NWMwODlhYWQwM2JhYzVjYWE4M2MzMDIwIn19fQ==",
},
"Beacon": {
	"name": "Beacon",	"id": "f5271023-2f28-4fbd-9a58-167967b9bee6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWRiZGFhNzU1MDk5ZWRkN2VmYTFmMTI4ODJjN2E1MWI1ODE1ZGI1MmUwYjE2NGFlZjZkZjlhMWY1M2VjYTIzIn19fQ==",
},
"Pillar_Quartz_Block": {
	"name": "Pillar_Quartz_Block",	"id": "237b32f8-b068-45e3-b6f3-9d3cbd4cb17f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjFmYWIwMjI1ZTIwZTg0NThlOGI3NTM5OTcxMzM4OGQ5Mjk4NTZiNTUxYjAxNDkwODFkYmIwMTIxZTJhMTY2NCJ9fX0=",
},
"Chiseled_Quartz_Block": {
	"name": "Chiseled_Quartz_Block",	"id": "eff4ba24-9410-4ad7-b0f9-469398668314",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODUyY2YxYWVmNGI2YWRiYzM4ZjE5NmRmYmE1MzZkYjVhMGIwNjhmMWFiOTE3NjlhZDhjNmQyZjc0ZDNhNWQ0ZSJ9fX0=",
},
"Sea_Lantern": {
	"name": "Sea_Lantern",	"id": "8f206973-cd58-41c7-afdf-f7eba2247856",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODI0YzZmZjE3MTRlYjJjM2I4NDRkNDZkMmU1ZWEyZjI2ZDI3M2EzM2VhYWE3NDRhYmY2NDViMDYwYjQ3ZDcifX19",
},
"Dry_Farmland": {
	"name": "Dry_Farmland",	"id": "8dbdb2af-603e-4ec4-8bff-51911f968a30",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTE1MzBmNzkwZTk3MmUwYmNjNjNhNTRkYzU1NTMyOTAyNTY4ZGVmOGRlZGYyZTIyZTc1OWJiY2JjNTVjMCJ9fX0=",
},
"Coarse_Dirt": {
	"name": "Coarse_Dirt",	"id": "a37264ac-b24a-4570-a297-c62ffa891e3a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmZhNzY0YjNjMWQ0NjJmODEyNDQ3OGZmNTQzYzc2MzNmYTE5YmFmOTkxM2VlMjI4NTEzZTgxYTM2MzNkIn19fQ==",
},
"Cauldron": {
	"name": "Cauldron",	"id": "a96559d1-7dba-45cd-ad6c-c125dec33f48",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDIyNzY4ZGI2NTczNjUxNjI2NTUyYmIyNjQ0MjYwOWE3Mjc5Yzc4NDNjYjY5YjhlNjAzZDJjMWRiNjQ1ZDAifX19",
},
"Mob_Spawner": {
	"name": "Mob_Spawner",	"id": "c65047c2-45b8-424a-8461-7a28ed109686",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjQ3ZTJlNWQ1NWI2ZDA0OTQzNTE5YmVkMjU1N2M2MzI5ZTMzYjYwYjkwOWRlZTg5MjNjZDg4YjExNTIxMCJ9fX0=",
},
"Prismarine_Brick": {
	"name": "Prismarine_Brick",	"id": "2da1086c-9507-46d4-9115-2b97a0af710d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzdjYmEyMzNmZmM0NTdiMzMwNTIyOGIyNWYzNWMwMjMzNTYxMWM5ZWZiNzY2OThiNWU5NGMwZDU0MWI1ZjQifX19",
},
"Dark_Prismarine": {
	"name": "Dark_Prismarine",	"id": "94b8945c-2094-4dc5-bb7a-47951d416bd6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmQ5MTg1OTg5ODk1NDk1OTQ0NDZlODNmMzM4NzM4OTExNzhkYTlkYjQyZjkxMmU1MjcyZTFmYjI0MDMxMmEifX19",
},
"Brown_Mushroom": {
	"name": "Brown_Mushroom",	"id": "9fe6de36-b793-4ffc-9189-b17fb1a4abfb",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmE0OWVjYTAzNjlkMWUxNThlNTM5ZDc4MTQ5YWNiMTU3Mjk0OWI4OGJhOTIxZDllZTY5NGZlYTRjNzI2YjMifX19",
},
"Light_Brown_Mushroom": {
	"name": "Light_Brown_Mushroom",	"id": "7b587773-2eb3-4d76-98cf-5073875d394d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2ZhMzljY2Y0Nzg4ZDkxNzlhODc5NWU2YjcyMzgyZDQ5Mjk3YjM5MjE3MTQ2ZWRhNjhhZTc4Mzg0MzU1YjEzIn19fQ==",
},
"Redstone_Lamp_(Off)": {
	"name": "Redstone_Lamp_(Off)",	"id": "c7b375a7-ed14-4448-acc5-01fab28f1546",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmQ1OGQ0NTkxNjVkNTk3ODc1M2VhYjVmNDRiZDYwOWYzZGI4NGVlM2JiMDE2OTMyMDUyMzg5ZDM4Yjg5NSJ9fX0=",
},
"Hardened_Clay": {
	"name": "Hardened_Clay",	"id": "2000e25c-c8f5-4aa3-b485-ba4688b8d47a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODJkNWZlZmUyMGRhZjMxYzIzOGVlMjI3ZGQxNDE4MjdhZGE1ZWY4NDgyZDhkMzU3YmJlNWE3Y2Y0MGFmODUifX19",
},
"Black_Stained_Clay": {
	"name": "Black_Stained_Clay",	"id": "4b355b2b-026a-40d5-8bca-b9403cc08eae",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTE3ZmY4YmFiYjkxYjRkYmFkNzUyNGU1OGVlZDRiMmY3MTU2NTc0NTk4OWFmOWEyY2NmY2YzMzI4ZjYxYmQyIn19fQ==",
},
"Blue_Stained_Clay": {
	"name": "Blue_Stained_Clay",	"id": "d2521f71-7112-4ad3-ac3f-fd7de5443a47",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvN2MxMTY2OTQ3MzFmYmQyNzJjMWZmYTQzNTJhNTM1OWI2YzNhNGNiNTg2NGE3NGE1ZGJlMGY2NjVmODM4NWMifX19",
},
"Black_Stained_Clay_2": {
	"name": "Black_Stained_Clay_2",	"id": "59f15e18-ebb8-44d2-a6d7-da53147093e0",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTRiOTMyZjExN2M4N2UxMTE4OWYxYzRjNDBjZmQ5MmJlOTExOWIxMTM3Y2Q2MTBjNjhlZGQ0MWFjNThmMTQifX19",
},
"White_Frosted_Donut": {
	"name": "White_Frosted_Donut",	"id": "6d38a755-bcf4-4c26-ab82-19a0e54dabab",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDA3YjhjNTFhY2VjMmE1MDhiYjJmYTY1MmZiNmU0YTA4YjE5NDg1MTU5YTA5OWY1OTgyY2NiODhkZjFmZTI3ZSJ9fX0=",
},
"Cyan_Stained_Clay": {
	"name": "Cyan_Stained_Clay",	"id": "a75f1ed8-83f0-4793-84f2-938976d51fc5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDQ2MzgxMWZkMGM0OGZjZDczYWJjYjdiYmU1YWE1ZWM2YmMyODA5ZmZjNTU3N2QzZjQ1NTlkZjMwNzY1ZiJ9fX0=",
},
"Pink_Frosted_Donut": {
	"name": "Pink_Frosted_Donut",	"id": "b48503a4-6dec-438c-a3bc-6b5da7fb1fde",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODM3YzliODJiMTg2NjU2ZTlmNjM2M2EyYTFjNmE0YjViOTNjZmE5ZWY0ZGFkNmYxNmI5NGViYjVlMzYyNjc4In19fQ==",
},
"Chocolate_Frosted_Donut": {
	"name": "Chocolate_Frosted_Donut",	"id": "1422239d-a249-453c-91ba-343ec9b46f92",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTlkYTU0ZmYzNjZlNzM4ZTMxZGU5MjkxOTk4NmFiYjRkNTBjYTk0NGZhOTkyNmFmNjM3NThiNzQ0OGYxOCJ9fX0=",
},
"Brown_Stained_Clay": {
	"name": "Brown_Stained_Clay",	"id": "3c83c32f-429e-4dd0-af89-ca721ec4aba0",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWVmYTdiNWU1ZTYzZDQ2ZDE0NjE1YzYxYmVkMTU0MjdkOTBiMjYxYzdjYTVlODE1OWM0NjZmMDk1NjFkYSJ9fX0=",
},
"Green_Stained_Clay": {
	"name": "Green_Stained_Clay",	"id": "ba0a102c-15a1-443c-8244-d7b7e9c49932",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjU1ZDUwMTljOGQ1NWJjYjlkYzM0OTRjY2MzNDE5NzU3Zjg5YzMzODRjZjNjOWFiZWMzZjE4ODMxZjM1YjAifX19",
},
"Light_Blue_Stained_Clay": {
	"name": "Light_Blue_Stained_Clay",	"id": "f7e64238-e0ea-4fb2-8ed2-ed2ef8d47a50",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODdiYzhmNWFjMmJmMzM2OTc0MWE5NjJkZTJhZGRiYWExN2QxNWNjNGRhZGIxOWFlZjZlOTQ0ODE3ZTZjMjQifX19",
},
"Lime_Stained_Clay": {
	"name": "Lime_Stained_Clay",	"id": "0135212e-7db4-490d-aca1-a59af95f3f3b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTVhMTE3ZTE2MWY3YTI5MWQwYTNhMTY4ZTc3YTIxYjA5ZDM5ZmZkZjU3NzNkMjJhYzAyZjVmYTY2MTFkYjY3In19fQ==",
},
"Magenta_Stained_Clay": {
	"name": "Magenta_Stained_Clay",	"id": "18a0f9f2-77c8-4724-ae31-ca99929ca5d1",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzQ0MTUyOGQyODhiMmI3OTczNmNiMjI0ODg3OGZiOTFlZmI0NDYyZDQzYmViZDcxMWY3MzI2YWZiYmY4NSJ9fX0=",
},
"Orange_Stained_Clay": {
	"name": "Orange_Stained_Clay",	"id": "e01d7cc8-87fc-408c-bb24-a0d8baf3ae19",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzMxNmMxNmIxYWM0NzBkMmMxMTQ0MzRmZjg3MzBmMTgxNTcwOTM4M2RiNmYzY2Y3MjBjMzliNmRjZTIxMTYifX19",
},
"Pink_Stained_Clay": {
	"name": "Pink_Stained_Clay",	"id": "555a5f84-2adf-4def-b270-b7bdd7e99b00",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjc1ZGI4MWUxNTkyZjMyZDc3MWRkNWRiYzZjM2E1MWU3YTBkNjZiMjJkZmUyOTZiOTY4Njg1MDVjZWVjIn19fQ==",
},
"Red_Stained_Clay": {
	"name": "Red_Stained_Clay",	"id": "890bb1c1-3730-435d-9fab-94d72af2e9a3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWU0MmY2ODJlNDMwYjU1YjYxMjA0YTZmOGI3NmQ1MjI3ZDI3OGVkOWVjNGQ5OGJkYTRhN2E0ODMwYTRiNiJ9fX0=",
},
"Purple_Stained_Clay": {
	"name": "Purple_Stained_Clay",	"id": "5a9545d0-567d-432a-b297-1e357447b544",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTZmNTRmODI4MzZhNTU5MjRlZTg1ZGVjNTZiYmJkOGNhMTQ2MzNkYWE5YmZlMzU2NTU5MmVkZjM5YTZkZSJ9fX0=",
},
"White_Stained_Clay": {
	"name": "White_Stained_Clay",	"id": "cb4876b0-aa13-4935-921f-861a6805fd5a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzE1OTU5NDM4OGJmMDEzYTRlM2U2ODY5ZmFhYmNiOTVkMzFkZDNmNGEyNThhNTM1ZTdjYmQ5MmM5OTg2YjcifX19",
},
"Light_Gray_Stained_Clay": {
	"name": "Light_Gray_Stained_Clay",	"id": "9f49f356-1def-4d65-b4f7-f5bd7dc13997",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWNkZTk5YjcyNzI4ZWY4ODE2NDBmYTUwNjhkMTIyZTYxZGQ5Y2Y3MThkYmIzNzA5ZmM1YjMyNmYxYWY1ZCJ9fX0=",
},
"Enderdragon": {
	"name": "Enderdragon",	"id": "433562fa-9e23-443e-93b0-d67228435e77",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzRlY2MwNDA3ODVlNTQ2NjNlODU1ZWYwNDg2ZGE3MjE1NGQ2OWJiNGI3NDI0YjczODFjY2Y5NWIwOTVhIn19fQ==",
},
"Turkey": {
	"name": "Turkey",	"id": "bf871b6c-92c7-454c-aa05-174e6cf98c45",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjA2NTU1NzA2YjY0MWZkYWY0MzZjMDc2NjNmOTIzYWZjNWVlNzIxNDZmOTAxOTVmYjMzN2I5ZGU3NjY1ODhkIn19fQ==",
},
"Bento_Box": {
	"name": "Bento_Box",	"id": "a2a2505a-4238-4ed3-bd0d-4313b3dc4b3f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmUzMDUyYzUzNWUxNDU5N2E0MTNlYzMyYjMyYWFmZGQyODY4NmZkYWI2ZWVkNzMwMzBlMWI5NGY3YzM4ZmYifX19",
},
"Chess_Board": {
	"name": "Chess_Board",	"id": "02a6ab0f-e6aa-4a9f-8447-a973bdfe8a8f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTQwOTRlZmZlZTRiYTJhYjFjMmZjNmM4ZWQxYzQ2OTBmYmExOWM4NjYxN2U5MjI3ZGIxZjU4ZDhkZDVkIn19fQ==",
},
"Hermit_Crab": {
	"name": "Hermit_Crab",	"id": "bc192f9d-fb89-4f75-ae7c-da701d3f7ea7",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTg1ZTY4MzRhNGJmMjZhNjUyNmY3Y2FjNGY2ZWFhOWY3ZmE3N2RiOGMxNDM1M2E4MTU4MmI1ZjY5OSJ9fX0=",
},
"Aquarium_2": {
	"name": "Aquarium_2",	"id": "5643c809-8d5c-40c6-949c-666c460fe7da",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzI4NDdjZDU3MTdlNWY1YTY0ZTFiYTljYjQ4MWRjOWUyMmM3OGNhMjNmODUxNmQ1NTNmNTU0MTJmYTExM2UwIn19fQ==",
},
"Regular_Fish": {
	"name": "Regular_Fish",	"id": "8f718637-6901-4301-bd98-ebde0cc19ed8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmY5OWI1ODBkNDVhNzg0ZTdhOTY0ZTdkM2IxZjk3Y2VjZTc0OTExMTczYmQyMWMxZDdjNTZhY2RjMzg1ZWQ1In19fQ==",
},
"Salmon_Fish": {
	"name": "Salmon_Fish",	"id": "e246c06c-5d6a-4fd9-b600-c6bd71336b7a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWRmYzU3ZDA5MDU5ZTQ3OTlmYTkyYzE1ZTI4NTEyYmNmYWExMzE1NTc3ZmUzYTI3YWVkMzg5ZTRmNzUyMjg5YSJ9fX0=",
},
"C4_Explosive": {
	"name": "C4_Explosive",	"id": "8b8fcca0-6880-4108-a46a-5a21320e0d7c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGRhMzMyYWJkZTMzM2ExNWE2YzZmY2ZlY2E4M2YwMTU5ZWE5NGI2OGU4ZjI3NGJhZmMwNDg5MmI2ZGJmYyJ9fX0=",
},
"Wooden_Crate": {
	"name": "Wooden_Crate",	"id": "9c1ec873-df5c-4aa2-9dac-291d7de98450",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWYyMmI2YTNhMGYyNGJkZWVhYjJhNmFjZDliMWY1MmJiOTU5NGQ1ZjZiMWUyYzA1ZGRkYjIxOTQxMGM4In19fQ==",
},
"Coconut_2": {
	"name": "Coconut_2",	"id": "961e817d-5384-4098-b43b-5ec6bece7b12",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzJjNjJmZDhlNDc0ZDA5OTQwNjA0ZjgyNzEyYTQ0YWJiMjQ5ZDYzYWZmODdmOTk4Mzc0Y2E4NDlhYjE3NDEyIn19fQ==",
},
"Coconut_3": {
	"name": "Coconut_3",	"id": "5754819a-7b82-4bb6-893c-7d67c08d6aca",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmY2MTI1OWE3ZWQ3NWRmYzE1ZjQzMjhmNjlmYTVkNTQ5ZWYxYmE5YzdhYTg1YzUzYjhjNzYxNzNmYWMzYzY5In19fQ==",
},
"Christmas_Present": {
	"name": "Christmas_Present",	"id": "6d46f5a1-a833-414c-ba0d-9842cb59316e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjU2MTJkYzdiODZkNzFhZmMxMTk3MzAxYzE1ZmQ5NzllOWYzOWU3YjFmNDFkOGYxZWJkZjgxMTU1NzZlMmUifX19",
},
"Chiseled_Sandstone": {
	"name": "Chiseled_Sandstone",	"id": "d3ff98e1-db2b-4819-b0ed-aa85400578a8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDkxZTdmOTAzMzc2NWNlYzk2OGYyNzJmYzU4YjczNDRjNDM0YTE3MjFmOTUzN2IyNWE2YWZmNGMyNDU3NmM1In19fQ==",
},
"Plate_of_Cookies": {
	"name": "Plate_of_Cookies",	"id": "010dc21d-cafa-4cc0-bcbc-3115acd9c139",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjM2OGE2OWM5NGI0NWRkMGE0MzVkZTIxN2MyOWNkYmQ0MzNjN2I0NDczOTFmYWEzM2MyNDFkYzA4MjcxIn19fQ==",
},
"Green_Ore_2": {
	"name": "Green_Ore_2",	"id": "948d2211-0eec-4bd9-a7b7-8679892f13b5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGM2YmFjZDM2ZWQ2MGY1MzMxMzhlNzU5YzQyNTk0NjIyMmI3OGVkYTZiNjE2MjE2ZjZkY2MwOGU5MGQzM2UifX19",
},
"Bundle_of_Burnt_Torches": {
	"name": "Bundle_of_Burnt_Torches",	"id": "f2190f0b-7b66-490a-bab4-00561d3d81df",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODY3OTNiYWM0YTFmOTc0MTQyZWY4OTE2NjQyNzEwOTQ5ZDdlMzhmODdhZWJkMzgwNzQyY2NjMzc0ZjFkZTEifX19",
},
"Books": {
	"name": "Books",	"id": "e2a0667e-40d7-49ea-8400-8a6ca8e55354",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDQxMWZjM2YyZGU1YjFlYjliODdlOTk3OTA5MTk5M2MzNDkwNTAyZWJhNzI2NWJlZDkzZDhiMWVkZjJjZmEzNyJ9fX0=",
},
"Safari_Ball": {
	"name": "Safari_Ball",	"id": "30844c45-3644-438e-95ae-7bcc4774aa7d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzJlYWM1ZjQ5OWUzMTIxNjUzNjRmMWFmMTUyNjYwY2QzZjE4ZDk0ZTJlZDU1YjI3ZGFmZThjZjg0MmE3OTRmMSJ9fX0=",
},
"Premier_Ball": {
	"name": "Premier_Ball",	"id": "70a20413-9f1d-4487-8fd3-354910ec65c9",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGI1YzhkNzNmYzdhMTQzYmFjYTRhMThiZGNjNzA1MTc2NzYyZmEwMTBlMzEzYjE0ZDgxZjhiNWViZGM0YzQ3In19fQ==",
},
"Marshmallow": {
	"name": "Marshmallow",	"id": "e03f6f63-a089-496e-9ea9-54427ec50ced",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjc4NTUxNjY5ODRhNzI1YmVjZmFjMWVhYjVjZmJkY2JlZTdlNDI2NDY2ZGRjM2JlZTRjNzFjZmQ3MmNiNTg4OCJ9fX0=",
},
"Monitor_4": {
	"name": "Monitor_4",	"id": "8686afe6-e01a-46b3-9b37-3c740964b637",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzc0MTcwYzY2YmYzMTQwZjIzNGIzMjJhZGQ3MjRjNWRmNjk0OWE5MjA5ZjgwN2ViZjg2ZDRmOWM4YzFlMTc4In19fQ==",
},
"Hamburger_4": {
	"name": "Hamburger_4",	"id": "f597e06f-e01a-492d-b63f-c23b9809ce01",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzVlMjc5ODhhNjUzODAxMGVmYzBlMjQ3NTZiYzNlM2VlYTI0ZDc1MzZiMjA5MzJjMTdlMDQwNGU1Y2M1NWYifX19",
},
"Chinese_Ming_Vase": {
	"name": "Chinese_Ming_Vase",	"id": "035a2141-af45-49cc-9eb7-5d9a22f82f53",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDVjYTVlODVjNGFlYTYwOGJkMzQ0M2NhYmRmMWMyYmRkZTNiNDMxYWQzYWEzOGZmZmUwNGEzMmViN2U1MjUifX19",
},
"Japanese_Lantern": {
	"name": "Japanese_Lantern",	"id": "04407f57-906a-4b3e-845c-3264be974f04",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzg1YWVlZDI1MmM5MjdiMmFjZWNiMWNkN2ZhYjQ1MDk3N2U1N2Q5Mjk2NjE0ZTk2NGQ0ZWNlNGQ3Yjg5ZGQwIn19fQ==",
},
"Chinese_Lantern": {
	"name": "Chinese_Lantern",	"id": "0efe054e-f000-4a72-a606-29d76e3219ee",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzA4MDgyODRiYTUwZWMwODhkY2Y2ZDllNTU0OWU5MWY4MjU4NWYxYzI4Mjk5YzQwNTkzY2M4YWFmMmRiNTAifX19",
},
"Bowl_of_Rice": {
	"name": "Bowl_of_Rice",	"id": "7aed6d20-5f47-4803-9679-621ad4112d39",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzM3N2UzZDZjMzc5ZmUzNGEyZTZhZmFiYmEzMmU3YWVjZjc3YmNkMzFhMWMzODM2ZWMzNTRhOTM1YTdlOSJ9fX0=",
},
"Skype": {
	"name": "Skype",	"id": "2fa164a7-b9a1-40c7-9029-a91a579dc7b9",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmVjMTgyZGE3ZDNjMGE4YWNjM2JlOWI3N2MyOWJlNDdlMDhjMjBiMDUwYjEzZmQ0YzRjN2Q3MWY2NjI3MyJ9fX0=",
},
"Globe_2": {
	"name": "Globe_2",	"id": "0464c495-0291-440a-9c19-ba0ff1797561",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGQ0OGU3NWZmNTVjYjU3NTMzYzdiOTA0YmU4ODdhMzc0OTI1ZjkzODMyZjdhZTE2Yjc5MjM5ODdlOTcwIn19fQ==",
},
"TNT_Minecart": {
	"name": "TNT_Minecart",	"id": "97a0f14d-8c68-4050-b710-60c11812d760",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzRkN2ZjOGUzYTk1OWFkZTdkOWNmNjYzZjFlODJkYjc5NzU1NDNlMjg4YWI4ZDExZWIyNTQxODg4MjEzNTI2In19fQ==",
},
"Furnace_Minecart": {
	"name": "Furnace_Minecart",	"id": "b1ef897a-7b95-4542-affa-2a9367a7cc16",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTA3OWFiYmFmYjk4MWM3OTVhOWEyZjgyYmFiM2ZiZDlmMTY2YjhjMGRiZjlhMTc1MWQ3NjliZWFjNjY3YjYifX19",
},
"Chest_Minecart": {
	"name": "Chest_Minecart",	"id": "51d804d1-d40f-4a6b-a823-8b95df669eae",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGNlZDM0MjExZmVkNDAxMGE4Yzg1NzI0YTI3ZmE1ZmIyMDVkNjc2ODRiM2RhNTE3YjY4MjEyNzljNmI2NWQzZiJ9fX0=",
},
"Command_Block_Minecart": {
	"name": "Command_Block_Minecart",	"id": "f6a8a394-eaa1-446d-9cf3-1a451fd29c75",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmE5MDUzZDIxNjNkMGY1NjExNDVkMzNhNTEzMTQ1ZDRhYzFmOGE0NThiYWE3OTZiZTM4M2U3NTI1YTA1ZjQ1In19fQ==",
},
"GameCube": {
	"name": "GameCube",	"id": "6998d903-472f-48c6-8df0-8fde000d5ab5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTI1NmY3ZmY1MmU3YmZkODE4N2I4M2RkMzRkZjM0NTAyOTUyYjhkYjlmYWZiNzI4OGViZWJiNmU3OGVmMTVmIn19fQ==",
},
"Magikarp": {
	"name": "Magikarp",	"id": "41dac880-eb6f-422e-9dc0-f7dec0e12933",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmY1OGZiN2NiZjlmOGRjZmMzYmM5ZDYxYzdjYjViMjI5YmY0OWRiMTEwMTMzNmZmZGMyZDA4N2MwYjk0MTYyIn19fQ==",
},
"Zoidberg": {
	"name": "Zoidberg",	"id": "9e052b46-699a-40ed-9444-cb312ca2b1d3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODIzOGMxMTRiMjdjYTlmZmQ2ZTc3NTRmZWM1ODJjN2UzNjk5MjgyODNiMmQ3ZmNlMTQ5ZWFhMzEyYmQyIn19fQ==",
},
"Unfezant": {
	"name": "Unfezant",	"id": "aa7a717e-dd5a-4e0c-a7a5-ed9f277e6f54",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjFmZDFjODNhZjdlN2U1MjIxZWZiMWY0MTQ5ZjdkMTZmNTk4MGEyNTFmMGE1ZDcxYWJlMzY2OTAyMjhhIn19fQ==",
},
"Hydreigon": {
	"name": "Hydreigon",	"id": "7272396b-96cb-414f-bb28-1f83b7af6996",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjM5NzVhYWFkMmRiYzMxN2UzNzg3YmRlYmFiOWZiMWViNDUyNmIzODJmY2NkZmViMTgxMzM5YjIxNTRmYmEzIn19fQ==",
},
"Eelektross": {
	"name": "Eelektross",	"id": "8e11953c-9e7f-4eb6-b1c7-ec6b8f027df5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmU1ZWY2MzRjN2VlOTczY2IwNGZlNDFlMWRiYjJmMDYyYjEyYzA3MjYxNDNkM2JmMjMyYjIzODFmMjRiIn19fQ==",
},
"Swanna": {
	"name": "Swanna",	"id": "52bf248f-61c9-4593-b595-b0c9b46d5510",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGM2MTJkNTQzMzJlY2RhYTQzOGYyMWY3YWZkNTQ0M2U5MTM1NWNkMWM2ODQ0ZjY4YTU3YmVjNmE5M2MzZmExIn19fQ==",
},
"Magmar": {
	"name": "Magmar",	"id": "fc2f9e8c-a1ca-4d06-aa62-2ee2ccbd4f10",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTY0NDY2MGU1NGNjMWZlMzE1YTk5Yjk0ZTE5OTExNWM1NGNkNzdjYmY3YzZhZWYyNDcwZGJlZjRmNjhmMzI3In19fQ==",
},
"Liepard": {
	"name": "Liepard",	"id": "51155d4e-0629-4476-bb46-85dc70883cf3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2U4NTI0ZjZhYzc2MjQ4OTViY2EyM2FlN2Q2Nzc3ZGE1YWMxYWQwZDcyNmJmNGU1Njg0Y2E2ZmRiYzI5MjliIn19fQ==",
},
"Lilligant": {
	"name": "Lilligant",	"id": "0833c982-551d-486c-a6bd-ce329180bfc8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTNlMWZhYTk5M2E0N2JkYTliYzdkZTBjNjkzY2E2YzgyNzI2NjI2YmQyNWE3YzA2NGQ3YWY3Nzk2MzZhIn19fQ==",
},
"Bisharp": {
	"name": "Bisharp",	"id": "8919374c-ad78-4495-bc17-ef133ac47f0f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTVmZTg3NzA0MmRlMzAyZjg4ZGI3ZGUyYWMwN2NlY2RkM2NiOGI3NzFkNGMwNTVhMzcyMzAzMzIxNWQ1YyJ9fX0=",
},
"Gyarados": {
	"name": "Gyarados",	"id": "7383215b-faa8-4b28-a897-6f224c3e4fae",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWFiOTNhZjY2OGNiODNlMzc5ZTllZGJjZGM0NTMyZjEyOTRmOTBjYjEzZGU2YTU4MmVmYWI4NzY5NmMzNmRkIn19fQ==",
},
"Beartic": {
	"name": "Beartic",	"id": "94143e12-c86b-46e4-af48-717563539f8c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvN2I2MDhlZDQ1MjM4MjVhNjFmNGJhYWI4OTZlMzhlYmRiYjgzZWUxNDlkNDQwYjlhNGUxMmJjOWVmZmI0YSJ9fX0=",
},
"Scrafty": {
	"name": "Scrafty",	"id": "e0f3e3af-2510-4c75-8c54-3dc65e8efad6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmU1MTk1OThjMzc2ZGI1MWMyZGRkMzM4NzgyOWQwNWMzNTY5YTBjN2YxOWM1MDFmZGM5Njc1Njc2MWVkMSJ9fX0=",
},
"Darmanitan": {
	"name": "Darmanitan",	"id": "7a039e1c-5682-4dc6-9751-3e3029cd9e99",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWViZWZmYTQ2MzU1NzU4Nzk1YTE1MzYzOWZjMTQxMWZkZmRkOTFlYzEzYzEyNjZjZTZiODc1ODVlMmZjMSJ9fX0=",
},
"Axew": {
	"name": "Axew",	"id": "482e00a0-578d-4aff-bc33-7c248eca69a0",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDE3Y2MxY2I4NDkyNDkzNTQ4YzkwZDcxNGMyM2U4ZTcxYTFmY2QwZDQ3YTQzYzExNDk5ZDJjMmJjNDIyIn19fQ==",
},
"Nurse_Joy": {
	"name": "Nurse_Joy",	"id": "bda33152-221f-4d17-b26d-601db5dd3a91",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjNkZTM4YTFjZWVhNmQ5NDkzZGYxOWE4YjU1YmIyMzg3MTFjZDVkYTRmNDM1ZDJlYzAyNjM3NmQ4NzQ2NDcifX19",
},
"Patrat": {
	"name": "Patrat",	"id": "7412ab21-cf28-41a7-bf21-b9b18d53c821",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmJmZTRhNTliMTY0NTQ4NzMyZmQ1Yjc1NGYyNjY0MTE5NjlhMmMyZmViMDhhODliNDBhMTI5MzI0NGFiZWMifX19",
},
"Throh": {
	"name": "Throh",	"id": "cea61351-2b5c-4d3e-bf3e-7435499ae85a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTlmM2FjYjkzN2VlYTVmZjQ0N2U0ZDQ1MzA4NjM1ZjZhYzc5MjNiMGE1MDRjY2QyYzhmNjcxODUzYjJlZGMifX19",
},
"Sawk": {
	"name": "Sawk",	"id": "a0920152-b8af-47df-b7f7-833fb59302a1",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWVmOWMxZDVmM2JiNGIxOTcyM2JkZDg1ZjIxOTY3NWRhMGZjOWRlYzVkOGFiMmU5NGEzZDlmY2FiMmQ1NzYifX19",
},
"Zebstrika": {
	"name": "Zebstrika",	"id": "03aae7f2-d654-40f8-950e-11523eaff12e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzRlOGE0N2U1NTI5NGVhZTY2ZTI1MDI3NGJhYTE1YzExNTU0YzA2MjRiNjMzY2MxZDE3ODc4NzVlNGIxMjYifX19",
},
"Charmeleon": {
	"name": "Charmeleon",	"id": "35f8c64c-89b0-4ec6-92fe-49140f0b4388",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDMxNzExZjMzNjY1YjNlMWU5OWVkOGY1ZjUwYTYzZTNmNmRlYzcyMWFmMjM5MWUzNGY4M2UxNWNlMjdhZiJ9fX0=",
},
"Sylveon": {
	"name": "Sylveon",	"id": "784a64fc-578e-4f10-acfc-92301640176e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDc3YTEyMmU2NjI4NmJlODUwNGU3Mjk3OWI0NzkxMmJiZTY5MTM2YzJlYWM2MWJhYTJiNzYzMWQ3ZTkyNmIifX19",
},
"Leafeon": {
	"name": "Leafeon",	"id": "2ec3e661-59b4-4379-a3c8-3192b50af584",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjc5ZGFhMjFmOWVlZWI2ZGM3ZjY1NmIwNTVkNmFjMzA5MGIzYzU4NmNiZTQxMWI5MWZiOTgyOTg1MGRhN2M4NSJ9fX0=",
},
"Glaceon": {
	"name": "Glaceon",	"id": "6542896c-05a3-4576-9912-29764e0d68bb",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGRjNTNiNzUzZGVlMWFmOTE4MTljZjI5OWJiNDRlZTk2ODI5MzYxMTQ5YTg4N2IwMWFkOTc0MWNjNzhiM2UifX19",
},
"Umbreon": {
	"name": "Umbreon",	"id": "f0edba69-9fcf-489f-b892-3dafb424e1bd",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjVhOGY2NzcyMmJlZjA5M2M2N2NjZTE0NTg3ZDY3YjM3NWUyN2E4MmZhNzc3YTg4MjE4YmExMWFmOWMxM2IifX19",
},
"Espeon": {
	"name": "Espeon",	"id": "73feda6c-40dd-465c-8295-82521535d6a2",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGNjMzc1MTAyYmE0MTkxNjI5N2Q3MjQ1MmNjNDgyYzc1Mjg1Yjk4ZTQzZGI2N2VlNWY0OTkyYWVhMDQzZTJiMSJ9fX0=",
},
"Flareon": {
	"name": "Flareon",	"id": "561e946b-b95a-4e50-8d05-fa8aa144a891",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTM2NTg3MmViZWE1ZWE5ZDE4MDQ5YWIxY2RiOGY1ODZmNDI5ZTc4NDYxMGEzN2ZiZmI2NmI2ZGM2MzcyIn19fQ==",
},
"Vaporeon": {
	"name": "Vaporeon",	"id": "b15f9388-d603-4bb6-a6c1-626dc13dc232",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjFiNzllZTZiNjFjMTFlNmExMjliMTljNzdiZDMwN2E0ODJmZWM1YWIzNjNjNjZhYjFmMWU0MjY1ZDMyNzU5In19fQ==",
},
"Jolteon": {
	"name": "Jolteon",	"id": "9e4eeaf1-c676-4509-ba97-f7f8b0bd9684",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODBkOGM0ODUzMzI2ZjAzNWIwMTA1ZWQ2OTgwMWE5MDljYTBiNzJlMDgxZmFjMDQ3N2MxZmU1NDc3MDI0YTUifX19",
},
"Pikachu": {
	"name": "Pikachu",	"id": "4df31c2f-01c2-4f61-aaf3-41282f136340",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGZhNjk1YjU5NjE4YjM2MTZiNmFhYTkxMGM1YTEwMTQ2MTk1ZWRkNjM2N2QyNWU5Mzk5YTc0Y2VlZjk2NiJ9fX0=",
},
"Caterpie": {
	"name": "Caterpie",	"id": "13f3e9dc-25cd-4486-884c-f09eb7730aa8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGFhMjUzZmFkZDg5N2E2YTE5YWFkMzk1OWM0NGZiNGNlYWM1YThjYTU4OGYxMGU1MmVjOGNmYmI0MTQ0YzZkIn19fQ==",
},
"Ash": {
	"name": "Ash",	"id": "83834e05-c504-40e2-88ba-b97576aaef99",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTY5YWI4YjBmMTlhMWM5OWZlM2FkODZlYTFhMmVhMmJlZWVmYmE4ZTFiOTM0MzMwODc0M2I3YmNiZDgifX19",
},
"Xerneas": {
	"name": "Xerneas",	"id": "6b18d73c-4867-4b5e-a519-6b4c7cd1d274",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzMxMjNmNTk1OWNlOGQ4MjEwZjY3MmFhNTQ5MWI2YjUwYjk3ZjI3ZTNhODQ2ZDU1ZDM1MmJjMmY0YzllYiJ9fX0=",
},
"Delphox": {
	"name": "Delphox",	"id": "638d27c1-66bf-40a5-9820-dfa51a5f70bd",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2I1NWM2NGI1NTVjN2Y4NjU0YzU1Yzc3OTNhN2UzOWFiZjVlZTRkOGNiN2FmOThhOGYxOTdkYWFmYjZhMGRhIn19fQ==",
},
"Chesnaught": {
	"name": "Chesnaught",	"id": "0f9c95f4-d4d0-46d2-9728-1f5c5582b44f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGY4NmFlYzIzZjNhODQ3ODJhZGUzZTUzYmFmN2I4YmYyYjNhNTExM2UyNDg3MmNlMmRkYmYzMTFmOThkNjEyZCJ9fX0=",
},
"Keldeo": {
	"name": "Keldeo",	"id": "e321c45f-dd51-4ce1-99b1-3f89f51296ba",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzc0ZWIxZDU5MmQ2MmU5MmMxZTZiNzc3NDI4MTBlMzJmZDQ1MGY3OWJlZjlhOWVmOWQ1NjRmM2NjYjI5OTAifX19",
},
"Kyurem": {
	"name": "Kyurem",	"id": "e4982169-8740-4d94-8f60-a7c3d62016b7",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmI5ZjgyNWRkN2M5ZDU4YWMyMjBiYzk0MjgyNTE3Y2UzOWVhOTA1MGUxN2E4M2U0OTJkM2FhMWZiOThlZGQ4MSJ9fX0=",
},
"Zekrom": {
	"name": "Zekrom",	"id": "ef5ea4a6-a738-4db7-8931-07533f579dd4",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGZlN2UxMzQ2YWZmMjUzMjE2ZWUwY2UxNDRmNmMzZDY2NGQwZDFkYzZkOWY2ZGI0NzE4M2NjNjc5Y2UwNDMifX19",
},
"Reshiram": {
	"name": "Reshiram",	"id": "d81a8b6a-59ab-43ee-b308-1cc7235c42c4",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWZmMzNkZTg4NzZlM2NkZDg5YWU4MTgzNWYzYWZmYzk0NmJjNDk4MzkzYzM2NDRjZmEwNGI2YTZjODlkMmZkIn19fQ==",
},
"Scraggy": {
	"name": "Scraggy",	"id": "20c64495-aa57-4f72-9a19-d8968b70eeca",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzFiZTM0ZTFlNTQyMTg0NWM0Yzk3Y2I5YTllZjg5ZjJmZGNjYzkyYjFlMmQ0ZDlhYmIxMzIzMzllOTAifX19",
},
"Samurott": {
	"name": "Samurott",	"id": "20d93475-1acd-4fae-964a-932758177365",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzc2OGJkMjVhMjM5MWJhOWQyN2ZmNmU2NmVmYzhlMzQ2ZDE3NjRiODViNDdiM2M4MWU3NDQ4MWVjZTIyZmYifX19",
},
"Emboar": {
	"name": "Emboar",	"id": "5ee24dbd-772d-4e83-ba6d-9a19c6b274ca",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzcxYWE1ZjAxMTQ0MzlkOTE4ZjllYjJlYTc4M2QzYTk2Zjc5MTkyNzY3ZDA1NWZjY2EzMWViNmZiNTExNGFmMiJ9fX0=",
},
"Serperior": {
	"name": "Serperior",	"id": "6f9c1854-4050-455e-b3a8-333b3d18d9d8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWQ1NzljMzE1ZjE2ZGNjOWI0OWQyN2JhMWQ2YTBmMzM3M2RlYTlkZWViZGE0MzYxMGMxYTcxM2VjODg0Y2QifX19",
},
"Victini": {
	"name": "Victini",	"id": "54049f77-ea2e-4a7e-8cae-b03e55077227",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTQxNDg1NGM4NjRmN2NiMWI0YjUyNTA5YTJmNDJlOTNiMmNhZGFlZGQyODlmYjIxZGRlYWNlNmQ4NzdkNTkifX19",
},
"Shaymin": {
	"name": "Shaymin",	"id": "eef4e1a9-5e5e-4d74-ace0-53477d6c34df",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmY1OGJmOWY4MTYzN2QzNjRlYWU3MTAzN2FhMGE1YzRjM2E0NmIyMTY5N2E2YmRkMWQxZjY1M2Y1YSJ9fX0=",
},
"Darkrai": {
	"name": "Darkrai",	"id": "4a7ad70f-006e-42f6-92a6-3592b0a4f33a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDRlZTdlZDNmNmVkZGMxMDE3YWI4Y2I1NTgzZTE3ZmI3Mjc5ZDY1NmE5ZGEwYzI4MzhkYjM2ZDIxN2QzOSJ9fX0=",
},
"Giratina": {
	"name": "Giratina",	"id": "f7cad43a-6b9c-429a-8e37-33fbd8fc0763",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDE2ZTI5NTBlNzhhYzBkMWIxOWFiYWM5ZDY2YmQ0ZGViMGRjNTlhYzQ0NGYxODQxZThhN2RlODMxNmVhYWIyNCJ9fX0=",
},
"Palkia": {
	"name": "Palkia",	"id": "20c79cae-eb30-481e-a6f1-e53f60c31e45",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWNhODk0MThlY2VmMTZmNWU0ODliYjI4NzRiZmIyYjBiMzExODRjNDE0NGIzZTc4ZTUzNGVkYmEzNTY4OTIxMSJ9fX0=",
},
"Dialga": {
	"name": "Dialga",	"id": "a6cab1b3-8739-40ca-8ab1-e7defdef758b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWFhZWQ4NGVhNGMzZTA2YWJhMzkyYTM1MTU1NWU0ZTk0Mjk3MTY2YmFlZWQ1MTRjOTI3OTE4ZTU2NGU2NTgzNCJ9fX0=",
},
"Empoleon": {
	"name": "Empoleon",	"id": "265c71b6-9404-450b-b442-1b9c83834a4f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDI2MjFkNzY2YzRlNjlmODU5MjhiZTRjZWRhMGI5OTZlOTVmNWEyMGZlOTYyMzJiZDAyZWQ0Mjc1MGQifX19",
},
"Piplup": {
	"name": "Piplup",	"id": "2f98d438-0b72-4d6b-a8a2-5b0eb1f7535a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmEzY2U3Y2FlODM1YjlkNjc3YTY3NTNlMjVjNjg4OTY2YWI2NzAyMTliNmE1Nzg4OGQyZWY3ZDI4MzNkZGI2OCJ9fX0=",
},
"Infernape": {
	"name": "Infernape",	"id": "57ccc770-4bb7-489f-941c-f627ed3204cf",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjBkYzhhZjljYzY4ZmYxZjJkN2I0YzY4MDc1MWYyMGRkY2MyMGYxNjYzZWNjOTAyYjVkMmI0ZjdiNzRkMWY2In19fQ==",
},
"Torterra": {
	"name": "Torterra",	"id": "b229c2db-ad14-4150-bab6-6af2d933bd53",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmRjNTcxYTVlODI4NWRjOGYyZmI2MWM5MThmYTQ3OWUyNzc5Yzg2ZDE2Yzk4MjUxOWRkNzUxY2NlNTAifX19",
},
"Deoxys": {
	"name": "Deoxys",	"id": "3e83ce31-be22-414b-8a6c-cdf611847fb6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDU5YjI4NGIzOTczN2QzMjQ5MzU3MjhhNzcxZWQxZWRiYmJlMzRhMjk4YWY2ZmMxN2JmMDdjMjczNWY0OCJ9fX0=",
},
"Rayquaza": {
	"name": "Rayquaza",	"id": "7198bbee-3d2a-4ccc-9620-ff4236eccbc5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2EzZWI1OTc3ZDdkMmRmN2NmMDZiZTE3ZTFmNmQwZWVkNWJiYzViYTM0MzM4Y2YyYmJiODk4NGE1ZDVhYiJ9fX0=",
},
"Groudon": {
	"name": "Groudon",	"id": "d4b139c7-5e28-4e4a-99c2-fbf7ab5b7be9",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjg0NjVlODZmZmRhYjhlYmY3YjhjZDNhZmY1ZDQ0ZjNhM2M5YmUxODhlZTcxNjZlYjU0MGRjNjhmMTliYjgifX19",
},
"Kyogre": {
	"name": "Kyogre",	"id": "d1c25dac-b26a-40fa-8755-0d7549f27f92",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmFlOTdlNjI3Y2FmMzEzY2Q5YmY4ZGRlZDQxNzUzZTIyYTdmNDM4MWQxM2UzZTYyMmExNmMwYTA0Nzg1NjM2YyJ9fX0=",
},
"Latios": {
	"name": "Latios",	"id": "418a4af1-de04-4a61-b449-a5e34654ae6b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTE3ZjQ1OTQ3YzliMjc1M2U1OTM0NTZiODdjOGNmZGFkYjA4YzdiOWE2N2M3NTM1ZDlkMzc5NGNhNmUzNmEifX19",
},
"Latias": {
	"name": "Latias",	"id": "bb12df08-0ce9-423b-9c60-c2b28bb34b10",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2E3MzhjZjU0ZWNiYThhYmZlOGZkYmIyNTQwNzc5ODg5MTIyZWExYTcxZjZjNzBkNDJlZDRlMThlZWQ0YmEifX19",
},
"Salamence": {
	"name": "Salamence",	"id": "508c3fe3-3334-4725-b676-7fdb6a5188a9",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWU2NDhhNmU2OTg4N2QzMjgxODgyNzBmNjY1NTI1YmEzOTllMzQ0ODc1NzE1ODliOGYzZjU2OTY0MThlZmMifX19",
},
"Blaziken": {
	"name": "Blaziken",	"id": "9aa27472-dc1b-48fc-8db0-5454a9c106f6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGVkYzVhYzljOTQ0N2UzYTdhOTI2ZmJjNTRkY2Y2NmQ1ZTM3M2I0OTIxMDgzYTFmZmYwNzQyMzk1YzkyYyJ9fX0=",
},
"Sceptile": {
	"name": "Sceptile",	"id": "b69b6cf6-9071-45c0-8b48-6c8f8e79a7ea",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWY4YjZhY2ZjOGM3MThiNzc1NzY5NDc2YjM4ZjJjM2MwNzJkZDMwZWQyYTM1YTI4MGMwZDNkOGYzYzRlMTgifX19",
},
"Ho-Oh": {
	"name": "Ho-Oh",	"id": "cb8fe255-9b45-462e-968a-143bd762912e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWViZmJmZTdhNGZjY2JmNTY2YzljZjQ5ZGU1NmU3ODRiZjY0MjFjODZhMzUyNGFhZjU0YjY1Njg5NDJkIn19fQ==",
},
"Lugia": {
	"name": "Lugia",	"id": "5a99bf64-21eb-4791-9aaa-75b231aa6481",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjY5ZjRhY2JkY2YzMjU5M2EwYTljOTdlZmJkZGMwMWZiYTFhMzFhNDFiZWI5ZGIxMzU1NTEzOTM4NmZiMzM3In19fQ==",
},
"Suicune": {
	"name": "Suicune",	"id": "1903ef50-c853-4bf1-8473-f11a670317f4",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjIyYmM5NWFmMDU1N2E1OTQwNDYyMDI1ZjI1M2U5NDk0Y2ZjYzU2YzVmZjQwNWUxODgwNWQxMzNhODdlZmQyIn19fQ==",
},
"Entei": {
	"name": "Entei",	"id": "6755dff2-bbd0-4ff6-a57c-c72ff3a4f0af",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGE0YWVlM2Y1MmU4MjcxODViOWI5ODJmNWZhNjU0ZmNiZGRhMzY1NzI2MWNlN2I1MzE0YzFiMjU3NmE4YTg1In19fQ==",
},
"Raikou": {
	"name": "Raikou",	"id": "aa2b7ffb-a35c-4aea-be55-dc8445ece09c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjU5YzgxMWMzNGQzY2VlNGQ1MTM4MzE3Zjc1M2NlMmU4ZGQxYjdiYWRlODhiY2RiYmI1ZDc0ZjVhMjFhODI4ZCJ9fX0=",
},
"Typhlosion": {
	"name": "Typhlosion",	"id": "1e97315a-ede7-4e46-8231-29586bd1c95f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2ZlMTRhY2NlOTA2OWY2NWVkYjM0ZTNhZDMyZjRkMzM4MTE2ZjcxZWE3YTg0MWU2YzU2NDM2MjhjMzlmMWI3In19fQ==",
},
"Meganium": {
	"name": "Meganium",	"id": "47323663-bf26-44ef-9086-20bb436aa026",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmFiNjhmNjNjNTVhZDNhZWIxNjE2N2EyZjk4ODk0YzE1ZWI4ZWFmMmMzNWE5M2JlYzRhNzczZDY0Y2E5YmFmIn19fQ==",
},
"Mewtwo": {
	"name": "Mewtwo",	"id": "afde4ccb-f3bd-4c26-9874-7b5358cb420b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWQyYzRiNDgxZjMyN2Y0NDAyMmJhYjM5M2E0MTg4NzRiM2Y0NWFjZmMzYmRmMDYwOWE4ODk0NDRiMzQ2In19fQ==",
},
"Dragonite": {
	"name": "Dragonite",	"id": "f6c17981-87bf-430f-bb16-0de1a4b9e77c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjE1MTY0ZGNlZGY4OGViMjY2YzY3NWJmZDc1YzU2N2MzN2IzNmIyN2UwNjQ2OWYzYTQ0Y2UyNjk3ZWQxNTQifX19",
},
"Blastoise": {
	"name": "Blastoise",	"id": "9832aa9b-9fd7-41d8-baa8-7ea01ca8a6fc",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDFkZjJiYjkxZjQzOTBhYWNmYTJjM2FhYmZlM2RlMDI2OWY0ZWI4YjhmMmRmZGJhMmVmYThjYWZjOTNkZGQifX19",
},
"Venusaur": {
	"name": "Venusaur",	"id": "b6f38f80-a53f-4502-8b5f-dd2649d8b384",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjczMzFjNTMxNDVjNmIxNzY2YzVlNGFkN2Q5ODI0YjI4ZmE4ZmVlMjc3NTMzYzhmNDUxZjljNTA3MDIyOGE0MiJ9fX0=",
},
"Charizard": {
	"name": "Charizard",	"id": "a1c04025-6c40-4862-a14e-b53b8e3a0fed",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODkzN2ZiYTBiMWU5ODg1ZmI0YTg0YzkxNTA1MTNkZWU4YjIxN2NkMDRmMTQwZDI1MDVjYWI4YWUzOWI1ZDQifX19",
},
"Lucario": {
	"name": "Lucario",	"id": "c89b7aad-c4c7-494a-8cec-66a8587f82ad",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjlkODM2NjU5MmQ5ZTJiYTg0Y2Y1MjEwMmY3MjM5N2Y3Y2NkMjg2YmFjNjIxMzNjMGE3MTA5MWZlYmUifX19",
},
"Feraligatr": {
	"name": "Feraligatr",	"id": "85d6d7c5-ad97-495e-b815-42660b11a4ba",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWY5MTllN2E1NWY5NWMyN2NmOTk1YjdhNWEzY2RlYzIyYWI5OTdmOGRmZmQ0MTQxZWEwOGRmNjZjNjBjZDVkIn19fQ==",
},
"Ewok": {
	"name": "Ewok",	"id": "d1423012-3fcc-4264-bbc3-698b33a16c90",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjMzZWNhNjk5Mzg0ZjNkMWZjNmNkMWQxZWQ1YThiOGMzNDc5OGM2NTY4ZWIxODQ0ZTUzY2JkYzM1OTgifX19",
},
"Mangle": {
	"name": "Mangle",	"id": "635ed117-c07c-467d-bba0-85533518712b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGUxMTU5ZTFhYWQyMzk1OTdkZWE5ODYyOWUwOTQ2NTQwMTVjNmRkYjljZWQyYzliMGYzYmMxMmQ5ZTYzYWY4In19fQ==",
},
"Computer_7": {
	"name": "Computer_7",	"id": "1cc1a38d-550e-447f-86bc-1181d277fe02",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTNkYTM5ZTU1NmM5Mjc5OTAzODRmYWExZmViM2I4MjUyNTJkYWM3OGNkMjg4Nzc5Y2RlMTExN2MzN2E4In19fQ==",
},
"Clock_3": {
	"name": "Clock_3",	"id": "a9208479-f451-4a46-9dbb-219eba4c9dbf",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmZlNGVkODM3ODQ5ZGVhODQwY2Q0Zjk5MjlmZGQxNTE5ZDE0YjVkZGUzODAzNTU5ZTdmNjNkMjdmMWU2ZjI5In19fQ==",
},
"Zelda": {
	"name": "Zelda",	"id": "93930bc0-c1ae-4e1b-96ac-f77d8aabc564",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmM5NmExNGRjMWNiOTQzYjhmZjNjOTJhYWNiMDEwMmMyMzg5ZWVkZWY1MGQzNmI3MTRkMGRiOThiMjdhIn19fQ==",
},
"Freddy_Fazbear": {
	"name": "Freddy_Fazbear",	"id": "ec845821-7123-465b-81a5-db71de766752",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWQzZjNlMTE0YzYzMWNhZGM4YTU2MDYwMjFiNGI0ZjllMTVmYTZlYzg5ZDNlZWViMWNlYzgyNWNmMjliODgzIn19fQ==",
},
"Bonnie": {
	"name": "Bonnie",	"id": "eea1e571-b002-4593-9121-cb768ea218dc",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmYzZmFjYTNkMTNlNmVjMzczZDdhMjhkYWI4OTU5ZmMyYjdjY2NlNWZiNjE3YjFjNTYzYWFkYmIwMzkzMiJ9fX0=",
},
"Chica": {
	"name": "Chica",	"id": "004db60f-fd03-4d61-9a52-d32b70f9616e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTdhMWQ0MmVmNzExODc1NzcyOTFkNmFlOTNhNGJlYjhiMTYxYTQzYmMyNjU2MjIwMWNhMjUxNTJiNmZmMzg3In19fQ==",
},
"Foxy": {
	"name": "Foxy",	"id": "f3b96da6-c931-4977-922d-e6c727677a29",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjI4MTJhYWE5NTQ3NzNmMmFkYTVhMmY3N2UzMmJhMmY3ZDhkMWY1ZDFiYjRhMzBmODYyNzk2NDJkM2Q4YmI4In19fQ==",
},
"Marionette": {
	"name": "Marionette",	"id": "7cb7a096-bf93-4ff3-98e4-de745a105d89",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvN2VjYWU4ZmRkOTIzM2I4MmRjMmY3YTk0NDU0NTBiNGE1MmYxYzM4M2EyNDE3OTkxYzgyZWQ3MWJmNzk1YWMxIn19fQ==",
},
"Mangle_2": {
	"name": "Mangle_2",	"id": "fe03aab2-c7d8-4295-a1d3-4c1784c26acb",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzczYWQxZWJlYjliNzUyNTcwOGE5MzNiZGFlMDg2NTk5YThkY2Q2NmQ4YjQxNDUzMWNlNjNiZjk5NTNiZDNlIn19fQ==",
},
"Link": {
	"name": "Link",	"id": "63b2a003-04da-450b-b07a-de6906f8f677",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGFhMDU5NjZkYmIzOWY3ODBlN2VhNjNhMjk1NjBkOGViNDhlMGMyNDk3YTgxOGE4OTU2NGE1YTE0YTMzZWYifX19",
},
"Stitch": {
	"name": "Stitch",	"id": "b4a745d0-2580-44c8-ae14-28ab38881b2d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTZhOGNiZTliNWI2NTYzNDVhZTAzNGJlZmVhZDI2YjkzNjc3ZmViYzg4NzI1NDkwNDE2Y2U3YmFiYmQ1OWYzZCJ9fX0=",
},
"Groot": {
	"name": "Groot",	"id": "83152cb1-7361-40c5-b5a8-90602d45e9fb",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjNjNzFhODVlZWIzY2Q2NDQ5MTU5Njc1YWE4OTI3OGEyYTFkNTg3YjRkMGI3NjgxNzRmYzJlMTVjOWJlNGQifX19",
},
"Warp_Pipe": {
	"name": "Warp_Pipe",	"id": "0c5f2d38-0e00-45df-a4d2-6f9d028273d3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjE5NTQ0NTYxOTdmZGVjMjJmNDgwYWM1M2U3MWM2YTY4YTFhODYyN2M2MDgwZGY1N2RiODNkZmMzNDY2ZiJ9fX0=",
},
"Goomba": {
	"name": "Goomba",	"id": "c60f6e7a-f36b-4113-86ee-9fb2967d543f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGU2MjE3MTI4Yzk4NzgzOTBlNTNjOTZiODEzNzAxMjI0OWE3Y2E2ODk2YzMwM2M1ZmI3ODJhY2U1OWQ5ZTRhIn19fQ==",
},
"Star_Lord": {
	"name": "Star_Lord",	"id": "a6204c1f-63ba-40d8-84a2-7f26459c1bb6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjViODFlMTc0N2IzMDQwODAxMDY5NzY4YjdjZWU4NWEzMmZlMGVhNTc4ZDdhNDg4NzgzYzc3NzhlNzJkN2U3In19fQ==",
},
"Boba_Fett": {
	"name": "Boba_Fett",	"id": "4761b4f6-2e26-4719-a4c9-cff0cacdc6ab",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmJmZWY1ZTA2NTMzOTc5ZDU3Y2FhNGZiY2UyNjBlYzFlNGYyNDE3NGFhNzcyZjYwZjA2OGEwZjlhYzYzZWUifX19",
},
"Storm_Trooper": {
	"name": "Storm_Trooper",	"id": "d644b0db-341b-4770-b3ee-f4da1de779b2",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTMyYzMzNmRhODRhN2JhNjEwYzg4MWFhOTk1Zjk2NjRmMTlkYzJjNDBiZDExNDQ5ZTIwYzZjM2EzZTc1MSJ9fX0=",
},
"Clone_Trooper": {
	"name": "Clone_Trooper",	"id": "9cdd5622-1624-43c9-9969-bdc43a816d26",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzdlMGQ3MmNmNDQxY2NlOTRjY2UzY2IzYmNjZWM2ZmVjNWY4YWMyZDc5YmM5NjNkOGI3NGQ1NGEyMDYyIn19fQ==",
},
"R2D2": {
	"name": "R2D2",	"id": "327722ba-304d-4cc3-a3d7-b037f3990d64",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvN2NlYmM5Nzc5OGMyZTM2MDU1MWNhYjNkZDVkYjZkNTM0OTdmZTYzMDQwOTQxYzlhYzQ5MWE1OWNiZjM4M2E3YSJ9fX0=",
},
"Darth_Vader": {
	"name": "Darth_Vader",	"id": "8d0d9feb-8866-48d5-ab7f-28f4a8947925",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzFjM2UxZjIyNGI0NDZjY2FjNmE2Y2MzY2Q5ODkxMDE5YTEyMmY5OTY5MWMzOTA3OTkyYTNhZjk5YTIxYjAifX19",
},
"Patrick": {
	"name": "Patrick",	"id": "c2ee5e5f-3b6e-41d5-b6ff-e41d6f66ff6c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjk3MWI5Mjc3MjljNmVhY2UxNjU5M2IzM2E5ODZkNjE5NDNkNjJmNjk2MWRlNmRiNTk5YTgxOGIyYWYzMiJ9fX0=",
},
"Spongebob": {
	"name": "Spongebob",	"id": "95972406-9912-4081-bb31-81c1d6801d98",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWU3MWVmMzlhZjRlMzNlYmNmNjlhNGJlNjM3OTU0M2M1MDE1YWFlYzc2YmFiNmZjM2Q4NjJhNzVkZmUzYzQ3In19fQ==",
},
"Ice_King": {
	"name": "Ice_King",	"id": "dd76d7df-eae7-4c01-af5b-cfeac1ec2230",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzJjZWU2MmI5OWQ4MDRkZGRlZGNmZTdhNzFhMTBjMmQ3YzhjMTYxNmFhY2I5MWRiODJlNDdhMjJkZDMxNCJ9fX0=",
},
"Jake": {
	"name": "Jake",	"id": "307838c8-48ed-4903-91f8-a75d6132a967",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTNkMTg3N2JlOTVhOWVkYjg2ZGYyMjU2ZjIzOTU4MzI0YzJlYzE5ZWY5NDI3N2NlMmZiNWMzMzAxODQxZGMifX19",
},
"Finn": {
	"name": "Finn",	"id": "c65d9bca-26f3-4e0a-885e-e2133bef2a3d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjUxZDU5NjZlYTQ3MmM0M2VmNTJhNWY2NTdmZjg1OTIwM2JlYTI4ZmU0YmVkY2U1YTFjZDc4OWIzYWM0YmEifX19",
},
"Sonic": {
	"name": "Sonic",	"id": "42aa23d7-a37c-450c-9869-4c8925638f53",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzVmNWM5ZmY5NGMwZGQ1Y2JiMWUyNzFhODE3ZTZlOWM1NTJlMzkyOGIxNTk1MTlkZDIyNmVmYWJkZCJ9fX0=",
},
"Metaknight": {
	"name": "Metaknight",	"id": "3ff82ea9-0aa0-41c6-aa2f-d93d1a62cfc0",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTQ2NDQ5MzczNjgyMzgxYTY1Y2FlNjVhMjI1M2Q4YjM2YjI5Mzc3NjQxMmM1ZGY4ZGVhNGQ5NjQzOTNhZjdhIn19fQ==",
},
"Ness": {
	"name": "Ness",	"id": "7ed3d846-29ec-4266-b505-ef92994a6048",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTk1NzdhOWJkYTY0ZjcxNmExNjkyMjIyOTlhZGQ1NmZjNzQ2Y2ZkODU1NjBiMzk3MWQ5NzYyYTQ4MzY2In19fQ==",
},
"Wario": {
	"name": "Wario",	"id": "297447ae-1a42-447c-9bfd-dc342e5c770b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2E4YjNhMWFmMmQ4ZmMzNzcyOWY2ZjYzZmRiYTVkNWUyMDk3NThkZWQ0YjJmY2Y2YWRkNGI4NWJmNjdlZGQ3MiJ9fX0=",
},
"Princess_Peach": {
	"name": "Princess_Peach",	"id": "575cc9a3-a425-493a-bbd0-dcbf18f0e91f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmViOTMzMWFjZGYzY2I3NmJkM2E1NmRkZDU5YjhiMTM5OGE1NDk1MmY1MzQ1NTFkZjgxNDIyYWJiZTk0ZiJ9fX0=",
},
"Fox_McCloud": {
	"name": "Fox_McCloud",	"id": "3eb4f734-528e-4518-a1db-4e838d691b2c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzFiZTI5NzUwZGRlYzgwOTk0YmRhNzk2NTNlMjFlZDcwZDViMmViNzkzZGE1MWQ1YTg3Yjg5YmY2N2RjYjk2In19fQ==",
},
"Bowser": {
	"name": "Bowser",	"id": "d9eebcd2-987b-429b-ad88-43d24f3af599",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTg2MDYxMGVkMzA3ODVlNjIyOWU4MmUyODk3YjQyZmRhYmIxZGY2Mjk2ZDM3MzFmYWMyNzQ0ZTU2YTllYjkifX19",
},
"Mario_2": {
	"name": "Mario_2",	"id": "98958836-4e85-4e5d-9c20-6ee46723f202",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmY3ZWI3NWU1NTQyY2M0OTM3YWFhZDViYjg2NTczOTNlYWYwMjY1MDA2ZWFjMWRjOTY2OTFmMzJlMTY0MzcifX19",
},
"Luigi_2": {
	"name": "Luigi_2",	"id": "3731f0dd-5c62-4f55-b894-4a1d9357b3ae",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmYxNTMzODcxZTQ5ZGRhYjhmMWNhODJlZGIxMTUzYTVlMmVkMzc2NGZkMWNlMDI5YmY4MjlmNGIzY2FhYzMifX19",
},
"Yoshi_2": {
	"name": "Yoshi_2",	"id": "91318ba0-ec9d-4072-95a7-fca5d39bd2dc",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjcxZWJjMTFiZGQxNTE0MTBkYTcwZDkzMTI1OWM0ZTk2OTUyOGU2ZjU4ODllOWM0YmIyZGQ3NjNiOWVhZmQifX19",
},
"Ash_Ketchum": {
	"name": "Ash_Ketchum",	"id": "dd4c0164-6dc0-498a-bd0e-57d49a16e407",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGMyMzU4NmY1MWZjOThiNTU0NTBiYjlhMzdhMDY2Y2FhYzI3NjVjMWQ0NzFjYjg5MTA5NGE4ZWMwMzJiZWZiIn19fQ==",
},
"Samus": {
	"name": "Samus",	"id": "3aa20f76-60cb-4c44-82d2-40d46425d370",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2E4ZDMxNGNjMzFjYThhZGYyZWU5OWJlMzliMzI3MzJiZTZkNmJlODUxMGJhOGVkNGFmMWI4ZmFiMmVmMGY5In19fQ==",
},
"Orange_Core": {
	"name": "Orange_Core",	"id": "3425e391-fc10-4ee0-96b8-7a74d09665d8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODVjNGVmZmJhNGQ5OWY0MzczMTRjOGE4NzU1ODU2NzEzZmQ4NWRjZDE1YjM2OTBjNzQ5Y2UxZTQ0NDc0In19fQ==",
},
"Sushi_Roll_2": {
	"name": "Sushi_Roll_2",	"id": "c9364146-7389-41fe-9fe0-0c8d3c61f16a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTA0MDUxODFkMzllNzYxOTdhMjYyYmU0Y2M2NTQxZThlM2VkMjQ2MzMzODRjODczYWRiOTFkZmUzOTAxYyJ9fX0=",
},
"Ganondorf": {
	"name": "Ganondorf",	"id": "02171f13-58e9-4ebe-92b4-38da9bd49a8e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2I3ODU0MzY5MTRkNDQ4ODg2Zjg3NmJlMGY0ODdjZjRjMzMyZDY5NmY2NjU3MGE4NGU4NmY4ZmE2N2YifX19",
},
"Toy_Bonnie": {
	"name": "Toy_Bonnie",	"id": "96df5bd9-b590-4b0d-b2a2-0385d97c382f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjY5NWI0Yzc5N2Q2NGU0ZjQ5MmU1NmI4MjU5YzViZTY0NDg2MTZiOWQ1OWYwNmMxOTkyNjFkYTM1OWZhNWQifX19",
},
"Toy_Freddy": {
	"name": "Toy_Freddy",	"id": "271efa84-b85a-4c3d-85f5-7428847be41d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDQ1NzkyZTk0M2YxODQ4NzhjYWZjOGEyNzFjMmNmYjNiMGY3YmI3NmMyYjE5YTEyOTJiNDQwZGIzNjc1NTcifX19",
},
"Toy_Chica": {
	"name": "Toy_Chica",	"id": "a03ae0e3-0f68-4231-8f3a-7abe3fa8a4f8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmM0NjI4NGM0OTQ4YmZkMTdjMWViNmQ5NmNkZmFmNGIxMzA4MGM0NzY4MTFhMWVmN2I5ZDc1YWIzYzE4NWQxIn19fQ==",
},
"Toy_Mangle": {
	"name": "Toy_Mangle",	"id": "ac93edcf-3722-4880-b034-7d2a5a4501ff",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmJkMjg0OTk3NzUyYTQ4MDJiOGNlYjRiNDY1MTMzOGI0NGI2ZDQ3Nzk2NWI3MzdmMTk4NWI2ZmFmNWUyMmFiIn19fQ==",
},
"Balloon_Boy": {
	"name": "Balloon_Boy",	"id": "c9767518-4e76-44dd-8aa8-72f83ae4ab09",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGE0OGRkNGFkMThhZmIyMmZlNTcyODUyNzA2YjgwMTlhNzhkOGYxNTk0ODZlNzQyZmY3NjFjNjM4ZDIwMmY1YiJ9fX0=",
},
"Black_Clock": {
	"name": "Black_Clock",	"id": "30e58370-2f88-435d-9bb6-a6ee17802d56",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmExMGRhNTI2ZTUxMTFjZmI2ZTNlYmQ0NzY5M2UxNjJkZDUyZDQxYTIxODIwMjhkYWE3YzJiMTlhYTMxNDMifX19",
},
"Vegetta": {
	"name": "Vegetta",	"id": "c1c36742-e1c8-4edb-b96a-0810a310a568",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGZjMWQ4OGJlMjUyODE2OGY2N2RhMTZhMTliMTRmMDRlMWU0OTYzYTk5ZGZjYjRlNDlkOTg0YTM1MTMxM2MifX19",
},
"Masterchief": {
	"name": "Masterchief",	"id": "3e41428a-ab5a-4c02-9fa7-f6e176a60b32",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjU0ODg0NGM0OGIwODJkZjU3Y2I0YWFkYzZiMjNhNGFmNDllM2JlMDI4ZjIxNmM2MmVmNTM5YWI4NGNjYmMwIn19fQ==",
},
"Bender": {
	"name": "Bender",	"id": "d9b02764-88e5-4b54-8ebd-080e1b09118d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmUyM2Q2MDdlOTJlNzI5YWY5NjY0YmZhMjZiZTk1OGI0YjJmOWYzZTAxMmVlZDgzM2Y5YTM1ZWE0YzRiMCJ9fX0=",
},
"Wheatley": {
	"name": "Wheatley",	"id": "2bfae29c-a956-4064-84ce-b37784c3702f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjY4NGY0YTZlZDE0Mjg2NWRiMDkzOGU0ODc2NzY4NDlhNTRkNjQzNzhlMmU5ZTdmNzEzYjliMWU5ZDA0MSJ9fX0=",
},
"Wilson": {
	"name": "Wilson",	"id": "588104b8-7f0e-4575-8c51-6c51a29d4b56",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTk4ZDRmZTUxNzZhM2FjY2RlYmIxYzNmYjBiMjZjZjNhMTgxZmZmYzE2MGVhNTJhMDI4Y2I0MWYzNGNmZTEifX19",
},
"Masterchief_2": {
	"name": "Masterchief_2",	"id": "121b724e-9b29-4321-9286-1ab3f0881dd8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjc3NWExN2MyOTQxYWU2YTJhNWYxODQwNTA5YjlhYjBjMGQ5Njg1OWE5YmMyNDk3OThiODZmMTk1MmIwODMyZSJ9fX0=",
},
"Green_Core": {
	"name": "Green_Core",	"id": "4fb52742-0d4a-4836-a61a-30d6c1bfce50",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzM1YTIxZDk1ZTg1OTc3NTlmYjI1OWM5NTFlYTY4ZTFhZDMzNzRjYTQxZTU2ZWYxMjZmZmFiZmUwM2MxZTAifX19",
},
"Batman_2": {
	"name": "Batman_2",	"id": "af20c020-6810-4abe-8437-97d3bff52bec",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjI1NmY3MTczNWVmNDU4NTgxYzlkYWNmMzk0MTg1ZWVkOWIzM2NiNmVjNWNkNTk0YTU3MTUzYThiNTY2NTYwIn19fQ==",
},
"Joker": {
	"name": "Joker",	"id": "c1e3bb5f-23bd-48b3-827a-b95d4f687d38",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWY0ZjY4MjVlZjZkNWU0NmQ3OTQ2OTdkMWJmODZkMTQ0YmY2ZmIzZGE0ZTU1ZjdjZjU1MjcxZjYzN2VhYTcifX19",
},
"Tortoise": {
	"name": "Tortoise",	"id": "ef56c7a3-a5e7-4a7f-9786-a4b6273a591d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTJlNTQ4NDA4YWI3NWQ3ZGY4ZTZkNWQyNDQ2ZDkwYjZlYzYyYWE0ZjdmZWI3OTMwZDFlZTcxZWVmZGRmNjE4OSJ9fX0=",
},
"Seagull": {
	"name": "Seagull",	"id": "14f316ce-9442-4884-8e43-5057451f104e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzNiZGU0MzExMWY2OWE3ZmRhNmVjNmZhZjIyNjNjODI3OTYxZjM5MGQ3YzYxNjNlZDEyMzEwMzVkMWIwYjkifX19",
},
"Bender_2": {
	"name": "Bender_2",	"id": "e5f8b552-18cf-4e19-837d-0ebfc17e7ad3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjE1ZmUyNDdkOWM2MWE2YzEzNzU0NGRlN2U2MjIwZjg0NzU5ZTMzMzM1YjBiNTUxODMyZmExZjhhMjYyYzIzYSJ9fX0=",
},
"Captain_America": {
	"name": "Captain_America",	"id": "acabdba2-25db-4c35-8ab6-dbc5a5efa080",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvN2VjNTI3NzEzZDM0YzExNjdlZWQwY2QxZTk2OWRiZmFkNWQ0NGE3NTIxNTRjY2FmNjRjMWM3YWI2YmMzZjNmIn19fQ==",
},
"Deadpool": {
	"name": "Deadpool",	"id": "64fd8f0f-ae62-4c4c-be25-a224f08756bf",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGMxNWMzMTYzOWU5M2YyYmIyNzRjZjI5ZDI0NGE4YTI5MDZlODBhYjhiZDJjMDEyMWM3ZmQxZTI2MjRkNTMifX19",
},
"Bowl_of_Spaghetti": {
	"name": "Bowl_of_Spaghetti",	"id": "8a145e5e-957d-418c-b000-511c971ae698",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzQ3ZmU2NWViNzQ1NDY4ZTg2ODczYTFiZGE0OGE1YTQ4OWZlZjkxY2M1MjJkODVlMDM2NGI1NWQ1M2Y4NjdlIn19fQ==",
},
"Bowl_of_Noodles": {
	"name": "Bowl_of_Noodles",	"id": "f15ab073-412e-4fe2-8668-1be12066e2ac",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjY4MzRiNWIyNTQyNmRlNjM1MzhlYzgyY2E4ZmJlY2ZjYmIzZTY4MmQ4MDYzNjQzZDJlNjdhNzYyMWJkIn19fQ==",
},
"Bowl_of_Noodles_2": {
	"name": "Bowl_of_Noodles_2",	"id": "ae43f401-53c1-47cd-a055-230851ec77db",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTk0ODU2NjNlNjUyNjRhM2RjMzA0NzJlNmE2OTMxNDQ2YmVkMzJjMmU4OTk5MDVmYWNmMThiMjkxOTY4OWMxIn19fQ==",
},
"Chinese_Take_Out_Box": {
	"name": "Chinese_Take_Out_Box",	"id": "af205cbb-f025-4556-ae51-d4272b0dd3f0",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmU0MjI4NmRhMzNhMjM4ZTRmMjdmZTcwM2ZjOGEwODcyMDFiNjk0MGZjMjM3NDRkZjk2NjNmYjk4NWRhMDI0In19fQ==",
},
"Tomato": {
	"name": "Tomato",	"id": "6d00d20b-a23f-43f8-bb26-b6ac346a107a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTkxNzIyMjZkMjc2MDcwZGMyMWI3NWJhMjVjYzJhYTU2NDlkYTVjYWM3NDViYTk3NzY5NWI1OWFlYmQifX19",
},
"Orange_2": {
	"name": "Orange_2",	"id": "997bdc8f-1269-43c7-9fe2-eeac02df6232",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODdiM2QyOTFkM2I5OWJjZDRjMzdhMTgzOWRjMTYwZDg4NWVjZDRlMjM3YjNhZWExYmFmMGFkYmIxNzc1Y2Q2NCJ9fX0=",
},
"Green_Apple": {
	"name": "Green_Apple",	"id": "799ee610-bcd8-409f-b235-0dca5a1ca8c2",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzRjMDVkZDVkN2E5Mjg4OWQ4ZDIyZDRkZjBmMWExZmUyYmVlM2VkZGYxOTJmNzhmYzQ0ZTAyZTE0ZGJmNjI5In19fQ==",
},
"Paper_Lantern": {
	"name": "Paper_Lantern",	"id": "edaaead3-ca5d-43cb-8b76-ec8e8a90164f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjYyODNlN2E4OGQzMjcxOTMwNGEzN2VkZTBjNmE4YzVkYzlkOWNmOWIwMGExNzljZjkwNGU4Y2U4MjEzMTIifX19",
},
"Lettuce": {
	"name": "Lettuce",	"id": "01041fda-5df7-4c5d-bedf-e4eba75b4de4",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDc3ZGQ4NDJjOTc1ZDhmYjAzYjFhZGQ2NmRiODM3N2ExOGJhOTg3MDUyMTYxZjIyNTkxZTZhNGVkZTdmNSJ9fX0=",
},
"Purple_Grapes": {
	"name": "Purple_Grapes",	"id": "768c2582-7d3f-40ca-b167-95d6f23f9037",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWU1OTM1ODYzYzUzYTk5NmY1MzM0ZTkwZjU1ZGU1MzhlODNmZmM1ZjZiMGI4ZTgzYTRkYzRmNmU2YjEyMDgifX19",
},
"Green_Grapes": {
	"name": "Green_Grapes",	"id": "7f1f7972-7228-449e-b391-68f993cae416",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGNkY2YzOGE4NDM4ZWQzYTU0N2Y4ZDViNDdlMDgwMTU1OWM1OTVmMGUyNmM0NTY1NmE3NmI1YmY4YTU2ZiJ9fX0=",
},
"Red_Grapes": {
	"name": "Red_Grapes",	"id": "2c382f99-71f3-4461-9861-4a9a361b8474",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDUxMWE1ZWU0ZDE3NjgyYTI1ZjdlOGE1ZGE2ZmY3Y2Q5YWQ5YzQ4NDRjMjU4YTZkZTIzZTdmODRmMjdmOWI0In19fQ==",
},
"Arrow_Up_2": {
	"name": "Arrow_Up_2",	"id": "e4d7b07b-59fc-4f77-b08b-b0446048dcd4",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNThmZTI1MWE0MGU0MTY3ZDM1ZDA4MWMyNzg2OWFjMTUxYWY5NmI2YmQxNmRkMjgzNGQ1ZGM3MjM1ZjQ3NzkxZCJ9fX0=",
},
"Arrow_Down_2": {
	"name": "Arrow_Down_2",	"id": "ccd469f7-1df1-42f9-8915-15de387906e4",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWI3Y2U2ODNkMDg2OGFhNDM3OGFlYjYwY2FhNWVhODA1OTZiY2ZmZGFiNmI1YWYyZDEyNTk1ODM3YTg0ODUzIn19fQ==",
},
"Arrow_Right_2": {
	"name": "Arrow_Right_2",	"id": "925b071a-7c83-43e7-9d83-8f231c8217d4",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjJmM2EyZGZjZTBjM2RhYjdlZTEwZGIzODVlNTIyOWYxYTM5NTM0YThiYTI2NDYxNzhlMzdjNGZhOTNiIn19fQ==",
},
"Arrow_Left_2": {
	"name": "Arrow_Left_2",	"id": "2fad8146-186b-4c9c-8c62-7d5ccb083faa",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmIwZjZlOGFmNDZhYzZmYWY4ODkxNDE5MWFiNjZmMjYxZDY3MjZhNzk5OWM2MzdjZjJlNDE1OWZlMWZjNDc3In19fQ==",
},
"Question_2": {
	"name": "Question_2",	"id": "808ac216-799a-4d42-bd68-7c9f0c1e89d1",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2FhYjI3Mjg0MGQ3OTBjMmVkMmJlNWM4NjAyODlmOTVkODhlMzE2YjY1YzQ1NmZmNmEzNTE4MGQyZTViZmY2In19fQ==",
},
"Exclamation_2": {
	"name": "Exclamation_2",	"id": "0a3628f0-f5b5-4a6f-8058-860006ca8732",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODdkMTlhYWJmY2ZkOTlmZmFiYTQyMTRjYWVmMjk5NTE2Y2U1MmU2ZDEzYmYyZGRhMTI1OTg1ZTQ4MWI3MmY5In19fQ==",
},
"Dot_2": {
	"name": "Dot_2",	"id": "7a7c6e7b-68ec-4a60-893e-111d3c988420",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmZmOTlmZjI3OWEyY2YyNWRlYjRiZDViNjZjMzU3NmI4MjRjYzk2YzM2NzgxMDI3YWY3MjdlZDNhNGMxMzA4ZSJ9fX0=",
},
"Slash_2": {
	"name": "Slash_2",	"id": "da6414e8-a76a-4146-865c-dc48141e0e25",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmQ1OTNmMDk0NWNiYjg1YThlMGJlN2Q5YTUyNjAxMGVlNzc0ODEwZjJiYzQyOGNkNGEyM2U0ZDIzMmVmZjgifX19",
},
"A_2": {
	"name": "A_2",	"id": "c4c09e00-8d4f-41da-a9d0-5fd811d1aff9",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmFjNThiMWEzYjUzYjk0ODFlMzE3YTFlYTRmYzVlZWQ2YmFmY2E3YTI1ZTc0MWEzMmU0ZTNjMjg0MTI3OGMifX19",
},
"B_2": {
	"name": "B_2",	"id": "a7cc3dde-907c-4f02-9648-1b9daf6e1de7",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDRjNzExNTcxZTdlMjE0ZWU3OGRmZTRlZTBlMTI2M2I5MjUxNmU0MThkZThmYzhmMzI1N2FlMDkwMTQzMSJ9fX0=",
},
"C_2": {
	"name": "C_2",	"id": "5703f4eb-cc57-42bf-9e83-0bbb728aa67b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmZmNWFhYmVhZDZmZWFmYWFlY2Y0NDIyY2RkNzgzN2NiYjM2YjAzYzk4NDFkZDFiMWQyZDNlZGI3ODI1ZTg1MSJ9fX0=",
},
"D_2": {
	"name": "D_2",	"id": "38557e36-a116-45d5-8a72-52782c75e95e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODkzZTYyMmI1ODE5NzU3OTJmN2MxMTllYzZmNDBhNGYxNmU1NTJiYjk4Nzc2YjBjN2FlMmJkZmQ0MTU0ZmU3In19fQ==",
},
"E_2": {
	"name": "E_2",	"id": "acce3d7b-c668-418b-83b1-f7a5c3b31caf",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTE1N2Q2NWIxOTkyMWM3NjBmZjQ5MTBiMzQwNDQ1NWI5YzJlZTM2YWZjMjAyZDg1MzhiYWVmZWM2NzY5NTMifX19",
},
"F_2": {
	"name": "F_2",	"id": "7404842c-af9a-4c28-bc6c-16d513d37fbc",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzU0Y2YyNjFiMmNkNmFiNTRiMGM2MjRmOGY2ZmY1NjVhN2I2M2UyOGUzYjUwYzZkYmZiNTJiNWYwZDdjZjlmIn19fQ==",
},
"G_2": {
	"name": "G_2",	"id": "3230268c-085c-4d08-92bb-8d509a191bcf",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDNjOWY4YTc0Y2EwMWJhOGM1NGRlMWVkYzgyZTFmYzA3YTgzOTIzZTY2NTc0YjZmZmU2MDY5MTkyNDBjNiJ9fX0=",
},
"H_2": {
	"name": "H_2",	"id": "137de0be-b6da-493b-979b-164fa435cd5a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjhjNThjNTA5MDM0NjE3YmY4MWVlMGRiOWJlMGJhM2U4NWNhMTU1NjgxNjM5MTRjODc2NjllZGIyZmQ3In19fQ==",
},
"I_2": {
	"name": "I_2",	"id": "ecc120f0-59d0-49f5-9d5a-1ca99bb08669",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDI0NjMyM2M5ZmIzMTkzMjZlZTJiZjNmNWI2M2VjM2Q5OWRmNzZhMTI0MzliZjBiNGMzYWIzMmQxM2ZkOSJ9fX0=",
},
"J_2": {
	"name": "J_2",	"id": "617069ab-bf17-418b-8687-3522590d305f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzU4NDU2Y2Q5YmI4YTdlOTc4NTkxYWUwY2IyNmFmMWFhZGFkNGZhN2ExNjcyNWIyOTUxNDVlMDliZWQ4MDY0In19fQ==",
},
"K_2": {
	"name": "K_2",	"id": "6e5daf43-e36d-41e2-a18b-536e013d4538",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWY0OWZiNzA4MzY5ZTdiYzI5NDRhZDcwNjk2M2ZiNmFjNmNlNmQ0YzY3MDgxZGRhZGVjZmU1ZGE1MSJ9fX0=",
},
"L_2": {
	"name": "L_2",	"id": "1192f380-a568-4a15-ac42-23b301878012",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGM4NGY3NTQxNmU4NTNhNzRmNmM3MGZjN2UxMDkzZDUzOTYxODc5OTU1YjQzM2JkOGM3YzZkNWE2ZGYifX19",
},
"M_2": {
	"name": "M_2",	"id": "4a9a8f9b-0b3a-4477-a22a-0ecf621169a2",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzFmZGU5MWIxOWI5MzA5OTEzNzI0ZmVhOWU4NTMxMTI3MWM2N2JjYjc4NTc4ZDQ2MWJmNjVkOTYxMzA3NCJ9fX0=",
},
"N_2": {
	"name": "N_2",	"id": "20b13668-f749-4a79-94c3-6e1006ae4de7",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWM3Yzk3MmU2Nzg1ZDZiMGFjZWI3NzlhYmRkNzcwMmQ5ODM0MWMyNGMyYTcxZTcwMjkzMGVjYTU4MDU1In19fQ==",
},
"O_2": {
	"name": "O_2",	"id": "1cd46fde-a398-4de4-a110-9d57b1e1b061",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODA3M2JiNDRmOTM0NWY5YmIzMWE2NzkwMjdlNzkzOWU0NjE4NDJhOGMyNzQ4NmQ3YTZiODQyYzM5ZWIzOGM0ZSJ9fX0=",
},
"P_2": {
	"name": "P_2",	"id": "d4ad9bc2-2447-4f77-9eb6-71515424c19d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjRiMjMxYThkNTU4NzBjZmI1YTlmNGU2NWRiMDZkZDdmOGUzNDI4MmYxNDE2Zjk1ODc4YjE5YWNjMzRhYzk1In19fQ==",
},
"Q_2": {
	"name": "Q_2",	"id": "a743ea94-2549-4d02-8293-7de302306b60",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmZlZGQ2ZjllZmRiMTU2Yjg2OTM1Njk5YjJiNDgzNGRmMGY1ZDIxNDUxM2MwMWQzOGFmM2JkMDMxY2JjYzkyIn19fQ==",
},
"R_2": {
	"name": "R_2",	"id": "380f8638-c8e4-4f8d-9b5a-a7d12ec0b83a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzAzYTFjZDU4M2NiYmZmZGUwOGY5NDNlNTZhYzNlM2FmYWZlY2FlZGU4MzQyMjFhODFlNmRiNmM2NDY2N2Y3ZCJ9fX0=",
},
"S_2": {
	"name": "S_2",	"id": "38e48f37-761a-4d31-b328-077f90cc0784",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjY1NzJlNjU1NzI1ZDc4Mzc1YTk4MTdlYjllZThiMzc4MjljYTFmZWE5M2I2MDk1Y2M3YWExOWU1ZWFjIn19fQ==",
},
"T_2": {
	"name": "T_2",	"id": "8bd042bc-5cb1-4577-8eb4-f62f4d91ba50",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzA4YzllZjNhMzc1MWUyNTRlMmFmMWFkOGI1ZDY2OGNjZjVjNmVjM2VhMjY0MTg3N2NiYTU3NTgwN2QzOSJ9fX0=",
},
"U_2": {
	"name": "U_2",	"id": "e435517b-1d7b-4487-9c05-071de05cd0d1",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTVhNmUzYWU1YWU2MjU5MjM1MjQ4MzhmYWM5ZmVmNWI0MjUyN2Y1MDI3YzljYTE0OWU2YzIwNzc5MmViIn19fQ==",
},
"V_2": {
	"name": "V_2",	"id": "eb32c1d3-5a7e-4761-9451-4e387508a9ad",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTc1MTIxZjdkOWM2OGRhMGU1YjZhOTZhYzYxNTI5OGIxMmIyZWU1YmQxOTk4OTQzNmVlNjQ3ODc5ZGE1YiJ9fX0=",
},
"W_2": {
	"name": "W_2",	"id": "916cf414-7240-44ea-bb89-385e7944e732",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjdlMTY1YzNlZGM1NTQxZDQ2NTRjNDcyODg3MWU2OTA4ZjYxM2ZjMGVjNDZlODIzYzk2ZWFjODJhYzYyZTYyIn19fQ==",
},
"X_2": {
	"name": "X_2",	"id": "345874ed-7a81-452b-821e-499bae0816cb",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTkxOWQxNTk0YmY4MDlkYjdiNDRiMzc4MmJmOTBhNjlmNDQ5YTg3Y2U1ZDE4Y2I0MGViNjUzZmRlYzI3MjIifX19",
},
"Y_2": {
	"name": "Y_2",	"id": "30dbb35e-31b8-41c5-bdb7-7d7d8a878ecf",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTM1NDI0YmI4NjMwNWQ3NzQ3NjA0YjEzZTkyNGQ3NGYxZWZlMzg5MDZlNGU0NThkZDE4ZGNjNjdiNmNhNDgifX19",
},
"Z_2": {
	"name": "Z_2",	"id": "e90c5876-53b4-4015-8127-806ffb52fd52",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGU5MTIwMGRmMWNhZTUxYWNjMDcxZjg1YzdmN2Y1Yjg0NDlkMzliYjMyZjM2M2IwYWE1MWRiYzg1ZDEzM2UifX19",
},
"1_2": {
	"name": "1_2",	"id": "cc70838c-9905-4fad-865f-8a5f83430272",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzFhOTQ2M2ZkM2M0MzNkNWUxZDlmZWM2ZDVkNGIwOWE4M2E5NzBiMGI3NGRkNTQ2Y2U2N2E3MzM0OGNhYWIifX19",
},
"2_2": {
	"name": "2_2",	"id": "8d5350b9-6464-4f4b-999e-462af24dc872",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWNiNDE5ZDk4NGQ4Nzk2MzczYzk2NDYyMzNjN2EwMjY2NGJkMmNlM2ExZDM0NzZkZDliMWM1NDYzYjE0ZWJlIn19fQ==",
},
"3_2": {
	"name": "3_2",	"id": "76480708-e78b-4bb9-9987-131f4f5b50f6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjhlYmFiNTdiNzYxNGJiMjJhMTE3YmU0M2U4NDhiY2QxNGRhZWNiNTBlOGY1ZDA5MjZlNDg2NGRmZjQ3MCJ9fX0=",
},
"4_2": {
	"name": "4_2",	"id": "c2ba9ae6-7c8e-4cb0-9e79-459e2f6b96ec",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjJiZmNmYjQ4OWRhODY3ZGNlOTZlM2MzYzE3YTNkYjdjNzljYWU4YWMxZjlhNWE4YzhhYzk1ZTRiYTMifX19",
},
"5_2": {
	"name": "5_2",	"id": "463ae31c-73d3-4b97-a4e0-03777f8a43d2",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWY0ZWNmMTEwYjBhY2VlNGFmMWRhMzQzZmIxMzZmMWYyYzIxNjg1N2RmZGE2OTYxZGVmZGJlZTdiOTUyOCJ9fX0=",
},
"6_2": {
	"name": "6_2",	"id": "e3cb6368-4c87-4e9b-a329-fbdca086bff1",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjMzMWE2YTZmY2Q2OTk1YjYyMDg4ZDM1M2JmYjY4ZDliODlhZTI1ODMyNWNhZjNmMjg4NjQ2NGY1NGE3MzI5In19fQ==",
},
"7_2": {
	"name": "7_2",	"id": "cb9c723d-3663-4ef3-a83c-c7405fddd7c2",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDRiYTZhYzA3ZDQyMjM3N2E4NTU3OTNmMzZkZWEyZWQyNDAyMjNmNTJmZDE2NDgxODE2MTJlY2QxYTBjZmQ1In19fQ==",
},
"8_2": {
	"name": "8_2",	"id": "36118da7-6989-4602-af43-82589e1ed6cf",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzYxYThhNjQxNDM3YmU5YWVhMjA3MjUzZGQzZjI1NDQwZDk1NGVhMmI1ODY2YzU1MmYzODZiMjlhYzRkMDQ5In19fQ==",
},
"9_2": {
	"name": "9_2",	"id": "8b867e70-124a-4a4f-9782-3b5581ab709b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTE5MjhlMWJmZDg2YTliNzkzOTdjNGNiNGI2NWVmOTlhZjQ5YjdkNWY3OTU3YWQ2MmMwYzY5OWE2MjJjZmJlIn19fQ==",
},
"0_2": {
	"name": "0_2",	"id": "a58ddb02-267b-4122-b8cc-5a6fbef9db04",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTVhMjI0ODA3NjkzOTc4ZWQ4MzQzNTVmOWU1MTQ1ZjljNTZlZjY4Y2Y2ZjJjOWUxNzM0YTQ2ZTI0NmFhZTEifX19",
},
"Dot_2_2": {
	"name": "Dot_2_2",	"id": "2f380f4a-64c3-4b2c-af18-6c491692e649",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmQ4OThjNDBlNDdjNWQyZDc2OTI0MDY1MzYwNzY4MDY1ZDYyNGVlNWI5ZWUwYmU5ZTEyYjk4ZmI3N2M3NiJ9fX0=",
},
"Ä": {
	"name": "Ä",	"id": "8a2ecdf9-9be0-4dac-90b5-560587de6772",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGM5YzJiYmQ3YjdmNzIwNGRjZWI1NzI5YTZmYmE3ZmQ0NWQ2ZjE5M2YzNzYwZWM1OWE2ODA3NTMzZTYzYiJ9fX0=",
},
"Ü": {
	"name": "Ü",	"id": "6961d9d9-e0f8-49f8-9d25-d099a1830efe",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2FlYzUzZTRhNmQyMjFhZmQ3Mjk3YjY1ZTU1YmU4NzkxM2NmOWNiN2Y0ZjQ1NDdmNzE4NjEyMDcwMWQ4ZCJ9fX0=",
},
"Ö": {
	"name": "Ö",	"id": "57d010fb-824f-4ab2-b34e-ba24535a94ea",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzgzZDQyYmNiOWI4ZTY2YzE2MTY2Y2NmMjYxZTJmOWY3OGM2OGVlNzg4NmRhMjI1ZTQzODk1Y2RiY2FmNWYifX19",
},
"Squirtle": {
	"name": "Squirtle",	"id": "84bef394-4bd1-4e65-aafb-2c746cb54a94",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjUzZWJjOTc2Y2I2NzcxZjNlOTUxMTdiMzI2ODQyZmY3ODEyYzc0MGJlY2U5NmJiODg1ODM0NmQ4NDEifX19",
},
"Red_Candle": {
	"name": "Red_Candle",	"id": "c16d04c8-778b-4fd4-9d96-7d367d81dc8a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWZkZGRkYjhlZWUxMWJjMzEyZDFhY2ZkNjIxYTQ0NmI1Njg2OGFhZjY2YTUwNzFjYTk0MjU1ODJiMThjZGQ2In19fQ==",
},
"Unlit_Red_Candle": {
	"name": "Unlit_Red_Candle",	"id": "4236d8b5-9918-48ff-a420-db5223af5f82",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2VhYTU1ZjQzZTVlM2FkNDliMTE0MGRmMjQ4NjYyNmNmOWYxMWRmYWY3NmYxYjI3OGI1ZDkzYmY0ZWRmMTI0In19fQ==",
},
"Scared": {
	"name": "Scared",	"id": "2cd3dbb5-6136-4127-9e14-89c328660871",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjM2ZTI2YzQ0NjU5ZTgxNDhlZDU4YWE3OWU0ZDYwZGI1OTVmNDI2NDQyMTE2ZjgxYjU0MTVjMjQ0NmVkOCJ9fX0=",
},
"Angel": {
	"name": "Angel",	"id": "fd9dd8fa-58b2-49cb-a5fa-eacb62bb9bfc",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2UxZGViYzczMjMxZjhlZDRiNjlkNWMzYWMxYjFmMThmMzY1NmE4OTg4ZTIzZjJlMWJkYmM0ZTg1ZjZkNDZhIn19fQ==",
},
"Embarrased": {
	"name": "Embarrased",	"id": "80e16b56-8d8c-4ea0-b3b2-dd69c7bd56cf",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjcyMGRmOTExYzA1MjM3NzA2NTQwOGRiNzhhMjVjNjc4Zjc5MWViOTQ0YzA2MzkzNWFlODZkYmU1MWM3MWIifX19",
},
"Kissy": {
	"name": "Kissy",	"id": "c7360c40-1b10-4a11-8322-697962372596",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTQ1YmQxOGEyYWFmNDY5ZmFkNzJlNTJjZGU2Y2ZiMDJiZmJhYTViZmVkMmE4MTUxMjc3Zjc3OWViY2RjZWMxIn19fQ==",
},
"Sad": {
	"name": "Sad",	"id": "fedea798-0986-4e09-bbfd-a2a6be7e230b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTQ5NjhhYzVhZjMxNDY4MjZmYTJiMGQ0ZGQxMTRmZGExOTdmOGIyOGY0NzUwNTUzZjNmODg4MzZhMjFmYWM5In19fQ==",
},
"Cool": {
	"name": "Cool",	"id": "bcefcc41-e997-4845-ae08-7b8a1a2d51b6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODY4ZjRjZWY5NDlmMzJlMzNlYzVhZTg0NWY5YzU2OTgzY2JlMTMzNzVhNGRlYzQ2ZTViYmZiN2RjYjYifX19",
},
"Suprised": {
	"name": "Suprised",	"id": "1a61537c-52d6-429d-9314-8420d631b494",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmMyYjliOWFlNjIyYmQ2OGFkZmY3MTgwZjgyMDZlYzQ0OTRhYmJmYTEzMGU5NGE1ODRlYzY5MmU4OTg0YWIyIn19fQ==",
},
"Dead": {
	"name": "Dead",	"id": "275a74fe-e3e4-4aff-86a2-68e3fb9720d7",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjM3MWU0ZTFjZjZhMWEzNmZkYWUyNzEzN2ZkOWI4NzQ4ZTYxNjkyOTk5MjVmOWFmMmJlMzAxZTU0Mjk4YzczIn19fQ==",
},
"Forever_Crying": {
	"name": "Forever_Crying",	"id": "b03562f3-2a20-4257-bb62-e040f552c297",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWYxYjg3NWRlNDljNTg3ZTNiNDAyM2NlMjRkNDcyZmYyNzU4M2ExZjA1NGYzN2U3M2ExMTU0YjViNTQ5OCJ9fX0=",
},
"Big_Grin": {
	"name": "Big_Grin",	"id": "988770c2-3a2d-41c3-a753-b13fa383e823",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTA1OWQ1OWViNGU1OWMzMWVlY2Y5ZWNlMmY5Y2YzOTM0ZTQ1YzBlYzQ3NmZjODZiZmFlZjhlYTkxM2VhNzEwIn19fQ==",
},
"Wink": {
	"name": "Wink",	"id": "81faf4e7-33e6-4cfd-bb15-21268d8def8b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjRlYTJkNmY5MzlmZWZlZmY1ZDEyMmU2M2RkMjZmYThhNDI3ZGY5MGIyOTI4YmMxZmE4OWE4MjUyYTdlIn19fQ==",
},
"Derp": {
	"name": "Derp",	"id": "58c6ac60-cbce-4ecb-981b-e79a87ad2bb6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2JhYWJlNzI0ZWFlNTljNWQxM2Y0NDJjN2RjNWQyYjFjNmI3MGMyZjgzMzY0YTQ4OGNlNTk3M2FlODBiNGMzIn19fQ==",
},
"Mustache": {
	"name": "Mustache",	"id": "0d7d6e4d-fb18-491b-a7b6-dbf45d923811",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzYzNmYyNzI0YWE2YWE0ZGU3YWM0NmMxOWYzYzg0NWZiMTQ4NDdhNTE4YzhmN2UwM2Q3OTJjODJlZmZiMSJ9fX0=",
},
"Big_Smile": {
	"name": "Big_Smile",	"id": "0beedb99-f64e-4a26-93f3-8f3af84050aa",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvN2ZmYWNjZjE3ODc5YjE3ODkxZmM1ZWY2NjQ3MmNjMDY2YTg1YmZhMzFiNmQ3ODZjMzJhZmVlNDc5NjA2OGQifX19",
},
"Smile": {
	"name": "Smile",	"id": "7eed1a86-983c-4fd3-95d6-1f085372628a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTJlOTgxNjVkZWVmNGVkNjIxOTUzOTIxYzFlZjgxN2RjNjM4YWY3MWMxOTM0YTQyODdiNjlkN2EzMWY2YjgifX19",
},
"Toy_Freddy_2": {
	"name": "Toy_Freddy_2",	"id": "b8309f53-9747-4931-9064-a2e011ede314",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGMzZjJlOTNkMDMyOTRkNGFhOTMxZTk5NjdmMmQ1YmNkMmFmOTA5YmZlMzhlZTgxZDFiZGE3ZjY4MmZkYzMifX19",
},
"Toy_Chica_2": {
	"name": "Toy_Chica_2",	"id": "d3610225-332c-4b5d-8ed2-2052553f1140",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2MzNzY2OGQ1ZWFlMThiYTc2NmNkNWM4ZWJjNzVjNDhkZTFiYTQ0Y2JlNDg5ZDgyOWE1ZWNhODY5MWJmNTU2In19fQ==",
},
"Toy_Bonnie_2": {
	"name": "Toy_Bonnie_2",	"id": "398de933-bba6-43da-a100-a6afff7afb51",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTc1ZGJlOTcwZDU0N2IyNTYxZjhiNjU4MTMwMzU5MTc2MjQ2Zjg5ZTc0YTRhYmRjNjgzNDE1NWM4YzRjODFhIn19fQ==",
},
"Pidgeot": {
	"name": "Pidgeot",	"id": "a20bdb44-c996-46a1-86f2-4ab799708f32",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjZjOTZhZWY2NTU4ZjI5YjI0N2JjOGUzOGQ5MzIwNjE0M2YxMzE0NDc1YzVmY2QxMWUyZWZjYzVkYjU1ZTg1In19fQ==",
},
"Pidgey": {
	"name": "Pidgey",	"id": "cefdef33-be77-49b1-a1c3-f052c4515ee3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMDE2ZjU5NWU4ZjY3OTFiYzE1NDY1OWE4OTc2ZjZhOGZmZDk4NDdjZjc1YTJiZjYzOTkyZTNhNjU1ZTAifX19",
},
"Metapod": {
	"name": "Metapod",	"id": "9174d869-a845-41eb-a51f-4b6977e22d65",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTFlZWUyYWNlOGI0YTg5NTcyYmQxYTU3ZDQ3ZmMxOTI3Yjg5YWJkNjBjYzc5Y2I4Yzc3ZmFhNzQ1ODE0NGUifX19",
},
"Butterfree": {
	"name": "Butterfree",	"id": "c95f8269-747c-468b-9f0e-440943840e64",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWUyYTUzYzI3ZjcyZmY4NDc5NTI0NWJhZDIzMjk4ZDhhNTlhMDYxM2RlZmJlZDYyNjM1M2ZjNjZhOTViIn19fQ==",
},
"Wartortle": {
	"name": "Wartortle",	"id": "9eb66d3a-dc08-43d6-b7b5-04a12fdfcf1f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDdhMGZkMTZlYmZkYmM1MWY5Mzk4ZTMzODM1Y2VlMGM2NjRhMDgxNDJlZTc5ZjhmZmM1N2Q2YjdlYjUxOGVmIn19fQ==",
},
"A_3": {
	"name": "A_3",	"id": "d9e6ae1b-8e1d-4ae7-8f5b-b581b1771d40",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWM2MGRhMjk0NGExNzdkZDA4MjY4ZmJlYzA0ZTQwODEyZDFkOTI5NjUwYmU2NjUyOWIxZWU1ZTFlN2VjYSJ9fX0=",
},
"B_3": {
	"name": "B_3",	"id": "a389402c-129b-4de2-8877-7912a1afe881",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODA0MWY1ZTg2OTgzZDM2ZWFlYzRlMTY3YjJiYmI1YTM3Mjc2MDdjZGU4OGY3NTU1Y2ExYjUyMmEwMzliYiJ9fX0=",
},
"C_3": {
	"name": "C_3",	"id": "5aafc18c-4341-4d65-bbfe-062706ffb067",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDk0NTk5NmM4YWU5MWUzNzYxOTZkNGRjNjc2ZmVjMzFmZWFjNzkwYTJmMTk1YjI5ODFhNzAzY2ExZDE2Y2I2In19fQ==",
},
"D_3": {
	"name": "D_3",	"id": "2bb28566-da08-4b69-963f-da9561f1d0a8",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTY0MTE1MGY0ODFlODQ5MmY3MTI4Yzk0ODk5NjI1NGQyZDkxZmM5MGY1YThmZjRkOGFjNWMzOWE2YTg4YSJ9fX0=",
},
"E_3": {
	"name": "E_3",	"id": "72c35d01-c507-4efc-9184-63c32cdf4687",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGIyNTE0ODdmZjhlZWYyZWJjN2E1N2RhYjZlM2Q5ZjFkYjdmYzkyNmRkYzY2ZmVhMTRhZmUzZGZmMTVhNDUifX19",
},
"F_3": {
	"name": "F_3",	"id": "b46b2241-5546-48db-a457-a2dbad23db27",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvN2U0MzM2NTZiNDQzNjY4ZWQwM2RhYzhjNDQyNzIyYTJhNDEyMjFiZThiYjQ4ZTIzYjM1YmQ4YzJlNTlmNjMifX19",
},
"G_3": {
	"name": "G_3",	"id": "4b0845df-5f9a-47ab-8ab7-044f810017fd",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTk1ODYzYjczNjM3NjA1ZmVhY2JiMTczYjc3ZDVlMTU1ZTY1MjA0Yzc4ZDVjNzkxMWY3MzhmMjhkZWI2MCJ9fX0=",
},
"H_3": {
	"name": "H_3",	"id": "ea507bde-e39a-4e8c-b6a7-35fffed066c6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2MxZDM1OGQ5MjcwNzQyODljYzI2YmZmNWIxMjQwNzQ2ZjlmNGYwY2M0NmY5NDJmNTk4MWM2NTk1ZjcyZGQifX19",
},
"I_3": {
	"name": "I_3",	"id": "84143d3c-f198-461d-aecc-40741d5494fe",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGYyMjk1ODY1YmRhNGU0Nzk3OWQzNmI4YTg4N2E3NWExM2IwMzRlNjk4OGY3ODY3MGI2NGExZTY0NDJjIn19fQ==",
},
"J_3": {
	"name": "J_3",	"id": "3814608a-d3e2-49ce-9ebf-fe4c25efd882",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTM0NDYyYjU1ZDdmNTgyMzY4MGFkMTNmMmFkYmQ3ZDFlZDQ2YmE1MTAxMDE3ZWQ0YjM3YWVlZWI3NzVkIn19fQ==",
},
"K_3": {
	"name": "K_3",	"id": "519c18a7-f30d-4f03-8975-9655f2360347",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzczMzI1YTkzNWMwNjdiNmVmMjI3MzY3ZjYyY2E0YmY0OWY2N2FkYjlmNmRhMzIwOTFlMmQzMmM1ZGRlMzI4In19fQ==",
},
"L_3": {
	"name": "L_3",	"id": "c5d1650f-c193-4f67-be23-7eae09a66e1c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjVhMWUzMzI4YzU3MWFhNDk1ZDljNWY0OTQ4MTVjY2ExNzZjM2FjYjE4NGZlYjVhN2I5Yzk2Y2U4ZTUyZmNlIn19fQ==",
},
"M_3": {
	"name": "M_3",	"id": "d6a7ebad-3f25-4d4c-9bf0-36b069dc38ca",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDQ2N2JmNmJlOTVlNWM4ZTlkMDE5NzdhMmYwYzQ4N2VkNWIwZGU1Yzg3OTYzYTJlYjE1NDExYzQ0MmZiMmIifX19",
},
"N_3": {
	"name": "N_3",	"id": "d621ae4e-f103-4b78-a180-c756b76b45b4",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODIzZTQzNGQ2Mzk1ZmU3ZTYzNDkyNDMxYmRlZTU3ODJiZDVlZTViYzhjYWI3NTU5NDY3YmRkMWY5M2I5MjVhIn19fQ==",
},
"O_3": {
	"name": "O_3",	"id": "425da042-932b-483d-9252-b7783871b66e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODg0NDU0NjZiZGM1YWQ1YmNlYTgyMjM5YzRlMWI1MTBmNmVhNTI2MmQ4MmQ4YTk2ZDcyOTFjMzQyZmI4OSJ9fX0=",
},
"P_3": {
	"name": "P_3",	"id": "ebfde078-cc98-48f1-ac64-608c8545cc28",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjlkZTYwMWRlZTNmZmVjYTRkNTQ1OTVmODQ0MjAxZDBlZDIwOTFhY2VjNDU0OGM2OTZiYjE2YThhMTU4ZjYifX19",
},
"Q_3": {
	"name": "Q_3",	"id": "5f94a01f-2bf4-497b-90fb-188e38055ca9",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjZjYTc2OWJkZTI1ZDRjYzQxZTE5ZTQyYWRjMzVhYjRjMTU1N2I3NmFmMjMyNjQ5YWNjOTk2N2ZmMTk4ZjEzIn19fQ==",
},
"R_3": {
	"name": "R_3",	"id": "ff745ee1-3463-473e-9e5d-db5b3f9e56a1",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjdhMTg4ODA1MTYyY2E1ZGQ0ZjQ2NDljNjYxZDNmNmQyM2M0MjY2MmFlZjAxNjQ1YjFhOTdmNzhiM2YxMzIxOSJ9fX0=",
},
"S_3": {
	"name": "S_3",	"id": "7fdd4eda-abdb-4019-aa25-9c23b69f0012",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjBkMDlkZmQ5ZjVkZTYyNDMyMzNlMGUzMzI1YjZjMzQ3OTMzNWU3Y2NmMTNmMjQ0OGQ0ZTFmN2ZjNGEwZGYifX19",
},
"T_3": {
	"name": "T_3",	"id": "28408552-4d4a-4830-a90e-8d2d98f84dcc",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjRjNzU2MTliOTFkMjQxZjY3ODM1MGFkOTIzN2MxMzRjNWUwOGQ4N2Q2ODYwNzQxZWRlMzA2YTRlZjkxIn19fQ==",
},
"U_3": {
	"name": "U_3",	"id": "0b7ee6c6-f3ae-43a2-b19b-0c9df57a752d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTlmNmQyYzZkNTI4NWY4ODJhZTU1ZDFlOTFiOGY5ZWZkZmM5YjM3NzIwOGJmNGM4M2Y4OGRkMTU2NDE1ZSJ9fX0=",
},
"V_3": {
	"name": "V_3",	"id": "4a7d6a90-977e-4708-976b-c52d27ecaa31",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZGNlMjdhMTUzNjM1ZjgzNTIzN2Q4NWM2YmY3NGY1YjFmMmU2MzhjNDhmZWU4YzgzMDM4ZDA1NThkNDFkYTcifX19",
},
"W_3": {
	"name": "W_3",	"id": "eacab58c-56fb-46d9-97f6-c1c2cab2cf9e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWVkY2Y0ZmZjYjUzYjU2ZDQyYmFhYzlkMGRmYjExOGUzNDM0NjIzMjc0NDJkZDliMjlkNDlmNTBhN2QzOGIifX19",
},
"X_3": {
	"name": "X_3",	"id": "1f5d7b63-569e-4d96-b7fb-ef437ef39850",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODM2MThmZjEyMTc2NDBiZWM1YjUyNWZhMmE4ZTY3MWM3NWQyYTdkN2NiMmRkYzMxZDc5ZDlkODk1ZWFiMSJ9fX0=",
},
"Y_3": {
	"name": "Y_3",	"id": "fd3e1792-dd5e-497a-b2af-c24a22ca75e0",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDljMWQyOWEzOGJjZjExM2I3ZThjMzRlMTQ4YTc5ZjlmZTQxZWRmNDFhYThiMWRlODczYmIxZDQzM2IzODYxIn19fQ==",
},
"Z_3": {
	"name": "Z_3",	"id": "34b483d5-b7b7-4a33-b8c1-bb725969bd4a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjkyOTU3MzQxOTVkMmM3ZmEzODliOTg3NTdlOTY4NmNlNjQzN2MxNmM1OGJkZjJiNGNkNTM4Mzg5YjU5MTIifX19",
},
"Illusion_Block": {
	"name": "Illusion_Block",	"id": "85539318-37d9-44d2-94f6-fc9b7f67bfc6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2MyYzU5ZmNkOTI2MjVlYzRkNTc4MTU5YTVmZDViZDQyNDdlMzgyZDQ5NDcyODRjZjUwZjk5OWM4NDExNmMwIn19fQ==",
},
"Illusion_Block_2": {
	"name": "Illusion_Block_2",	"id": "d27723ec-8f68-4bbf-a2b0-58f0adf0b7f9",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjQ2MmRkZmE1NTNjZTc4NjgzYmU0NzdiOGQ4NjU0ZjNkZmMzYWEyOTY5ODA4NDc4Yzk4N2FiODhjMzc2YTAifX19",
},
"Hot_Toaster": {
	"name": "Hot_Toaster",	"id": "e21d3410-6af7-4842-bfb5-34034d1ad581",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWVkNmZmNGQwZjJmZDkxODQ3YTgzNmU0NzZhY2Y4ZDRhZmJhZGY0ZDg0MWUwY2Q0ODc0NmY3MzQ3Y2Y0MiJ9fX0=",
},
"Ferret": {
	"name": "Ferret",	"id": "a6102422-04ff-4bad-a4a0-01000ea262bf",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjM2ZWRmN2RlOWFkY2E3MjMwOGE5NGQxYzM4YzM1OGFjYzgyOTE4ZmU4ZmNlZDI1ZDQ3NDgyMGY0Y2I3ODQifX19",
},
"Dragon_Ball_#1": {
	"name": "Dragon_Ball_#1",	"id": "bb69009e-efe8-4fef-a895-9ef238b30219",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDkyOTlkYzAyYzM1ZjFiYzFhNjg5NWQ3ZmMyOGRlNzdjYTg5MGQwNjYzY2VjNWRjZDZlYTg0NjBhZjExMjEifX19",
},
"Dragon_Ball_#2": {
	"name": "Dragon_Ball_#2",	"id": "3b1cd539-ecc2-4e1e-9aed-43e391b66552",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODA2YWM4MmUzYzc0MjdiYmNmMTU4MjFlODgyZDczYWViODBlZWJjYzZiNDU1ODI4MzI4YWViNzBkNzFhIn19fQ==",
},
"Dragon_Ball_#3": {
	"name": "Dragon_Ball_#3",	"id": "1d3403ba-b935-4ef3-be64-288249ece142",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzk5OTI1NGE3Y2E4ZDhiYTFmYWRkY2JhYjlkYTMyMzc0OWExYTBmNjVjODlhMDE2ZjY4MjM0Mjc2ODQ5NSJ9fX0=",
},
"Dragon_Ball_#4": {
	"name": "Dragon_Ball_#4",	"id": "183f1ddd-1219-4090-b200-a1eaf6b14845",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmE0MzFhNWVlM2JlNzliOGViNTdhYjk1YzhjOTZkN2Q3NTE5MzJkNmRiZDkyNzI3ZjZlMzcyZTdjNWYifX19",
},
"Dragon_Ball_#5": {
	"name": "Dragon_Ball_#5",	"id": "a1779c69-2326-4b3f-bcea-43400b8725ad",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGI3MzI1N2U5YmM0N2JjY2JhZmFhNTQzNzNjYTExYjg3NWU1YWMzNWM5ZDU5NzNiNTgxMDU0Y2M5YmJhODgifX19",
},
"Dragon_Ball_#6": {
	"name": "Dragon_Ball_#6",	"id": "a9314743-7dd1-49b8-93fb-c8e7f8c52434",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjdmYjZhNWFkYTQ3MDU2YzhiZjk3NTY2NDk4ZjVlYTQxNzMzMzlmYTc4MTljYmNlOTcwMDllOTA1MGRlIn19fQ==",
},
"Dragon_Ball_#7": {
	"name": "Dragon_Ball_#7",	"id": "6521bbc1-7622-4653-9870-9a91498ab205",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWMxYTdlMTkzZjM3YzJjNTRlMzU4ZjIyYThhMmQwMjg5NzkzZGQzYjJkNmM3OTllODQyNGI5MjZhMzk1MSJ9fX0=",
},
"Sandwich": {
	"name": "Sandwich",	"id": "560931c5-4bb4-4187-9c94-77d3171e586e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTQ5NjU4OWZiNWMxZjY5Mzg3YjdmYjE3ZDkyMzEyMDU4ZmY2ZThlYmViM2ViODllNGY3M2U3ODE5NjExM2IifX19",
},
"Cherry_Pie": {
	"name": "Cherry_Pie",	"id": "c72068ed-69e1-4027-928d-440585efab0e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDUzYzFlODdlNTM3ZjFhYjI3NzRkZGFmYjgzNDM5YjMzNmY0YTc3N2I0N2FkODJiY2IzMGQ1ZmNiZGY5YmMifX19",
},
"Pie": {
	"name": "Pie",	"id": "8404083b-57bb-4837-9b53-7d7733b98111",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjQ4MzkxMmZiMmEzMGQ3MzM2MWMwMzg0NDYxMTc3NWIxYzMzMjE4YjNhNTZiZGVkNmFlNzkyYzJlNDM5ODgxIn19fQ==",
},
"Chocolate_Cake": {
	"name": "Chocolate_Cake",	"id": "e14748a3-fd60-4feb-9fce-7a6c7389a948",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTExOWZjYTRmMjhhNzU1ZDM3ZmJlNWRjZjZkOGMzZWY1MGZlMzk0YzFhNzg1MGJjN2UyYjcxZWU3ODMwM2M0YyJ9fX0=",
},
"Bulbasaur": {
	"name": "Bulbasaur",	"id": "bd8af622-477c-41e0-8068-ca4d02de10a5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTNlODZhOGE0MjMxZDFjZWU4MzcxNGViNWU5MzljNmQzMDc4ZWE2ODMyYmY5M2ViYTY2ZDEyZGMyNWVhOTVhIn19fQ==",
},
"Ivysaur": {
	"name": "Ivysaur",	"id": "f16c7dcb-d30c-4948-ad17-f3b8c8b47c34",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzk5ZWM5NDNiNDhjNmY4MmYzMmFjZDllODYyNjU0NmRlODQxNmNjZTRkYTQxY2JhYTAyYzY5ZmVlZmJlYSJ9fX0=",
},
"Swampert": {
	"name": "Swampert",	"id": "fa4747eb-403c-4c7d-8e47-cf4d03c32c79",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjdmYmQzNjY3ZDMyNThjM2MyYTI5MTQ5N2Y0MjdhYjJiM2NlYWE1ZGYwZWZmNjJlZGMzMjE5ZGNkNzE1NzAifX19",
},
"Growlithe": {
	"name": "Growlithe",	"id": "641385d3-db22-4b8c-b8c4-9d6df1c8a510",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODE1MjEzZDM4NTI2OGFkM2JkMTc5ZTYxM2YxZmFjOTlmYTgzOTI4MzFmYzlmNmYxMGRiNTk5Y2Y1OWNlZmZiIn19fQ==",
},
"Greninja": {
	"name": "Greninja",	"id": "607f3d74-c3fb-4133-a4c4-f47d6cb70b50",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDkyZmQyNjRjZmMwMmY1OGNjYTdhZGYwZmE2OThhYWY4ZWYyMzM5YjJlZTQ5N2MzYmNmZjc0ZWI5YWViYTkxMiJ9fX0=",
},
"Charmander": {
	"name": "Charmander",	"id": "85736b63-e091-4d8e-9f31-42e549d40b95",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTM4OTkyZmE3MWQ1ZDk4Nzg5ZDUwNjFkZGQ2OGUyYjdhZjllZmMyNTNiMzllMWIzNDYzNDNkNzc4OWY4ZGMifX19",
},
"Chespin": {
	"name": "Chespin",	"id": "66625908-06f3-4a1c-8abd-4e96ca6fdae3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzU2YWRmODVjZDhiODg2ZWM3NWI3MmQ3NjEyZTViNmQyZmQ3ZDUyZTY1NzMxNmNiNjZmNmQ5ZDY4MjY5MzVhMiJ9fX0=",
},
"Cobalion": {
	"name": "Cobalion",	"id": "36587d8a-60d2-489f-ac77-bdb8a18dd21b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTFjNTM2YzhmYmE1OTZhZTk3ZWE1MGQ2ODNmMWViYjg5NWRkZjY2MmFkY2VkYTkxNjkwYmM1OTdkMzg0MyJ9fX0=",
},
"Terrakion": {
	"name": "Terrakion",	"id": "c38bf9e5-9cc6-44f3-99d6-325027f01f6d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNmRmYjVlNmY4YzgyNjc2NzliNzgyODBkNWExMGNkNDEyMmU1MGE5N2JlMjlmYTBmNGYxYzYxZmZkM2ZkYSJ9fX0=",
},
"Virizion": {
	"name": "Virizion",	"id": "eb8adf0c-5aa1-49f1-ba15-eecb42a711c4",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWRiZjNhOGVlOTkxOGU5YzFjMDc5YWQ2OTYzZTg0YWU4MjQyN2NmNGVhMjBmZGM2MmFhMWQ2NDBjZWJhIn19fQ==",
},
"Noivern": {
	"name": "Noivern",	"id": "ebba4ec9-ba2c-48fd-852c-b77a60da236b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjNlODdjYmJhMjcwNTlmNWU4YzM0ZjU5OWMyNWFhYjk0MjIwNjNlYWJhODAyYzMyNzc2YjNkODBhYWQ3NGY2OSJ9fX0=",
},
"Jigglypuff": {
	"name": "Jigglypuff",	"id": "2eb109d9-35ba-43a1-9175-39725cddee37",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmE2ZjEyNjIxZTUzNjM1OTViYzZkNjhmYTE4NWNlZGZjZWFhZGEzZDgyYjYwYzEzZmRjNGEwMzI2OSJ9fX0=",
},
"Grovyle": {
	"name": "Grovyle",	"id": "b369d697-3e7e-402d-9493-9035628c4718",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzU1Y2FlNDkxM2U5N2Y0OTgzOGQ0YThkZGY3MTFmOTU5OGQ1NjJiY2I1OGUzOWYzZDQxYzYwZDNiZTcyMSJ9fX0=",
},
"Gabite": {
	"name": "Gabite",	"id": "141ceff3-404d-417e-85d6-4567c164b613",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTQ4MzJjZTJlNjVhYzE5NjQ4MmFmZTQ2ZGZmY2ZkODUyOWJjNDc3OWNjYjdlOWE1MmRmYTVjYmRhMTQ0ZDVjIn19fQ==",
},
"Pokemon_Egg": {
	"name": "Pokemon_Egg",	"id": "aed1706c-4f5c-4a9f-895f-1e14489d6191",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTJhODUwZmVhYmIwNzM0OWNmZTI0NWIyNmEyNjRlYTM2ZGY3MzMzOGY4NGNkMmVlMzgzM2IxODVlMWUyZTJkOCJ9fX0=",
},
"Articuno": {
	"name": "Articuno",	"id": "b1cd4221-4151-4bc9-8ab6-d0ed95397045",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmQ0Yjk4NjdkZWRlOTNlOGYyMjZmZjkxYjc3ZDdhM2NjYWYzZjZiMWVmNWY0ODZjZTYyZDExZTk0MyJ9fX0=",
},
"Luxray": {
	"name": "Luxray",	"id": "6f865080-5aeb-4edd-a159-84ab24576593",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDA2MDUxZmMyOGZjZmRiZWZiNTQzYWQ3OGEyYjI1NGIyNTRkZDZmMTcxYzczNDZiNDZhNDZkZDM5MjNmIn19fQ==",
},
"Arcanine": {
	"name": "Arcanine",	"id": "3bc6933f-236e-491b-8ca2-ac9ba8bcc545",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzQzMGJkYTE5YzQ3YmM3OTFiZTExZjVjNzRiY2JkODNlZmZjNjA2ZDI5MWJiNGQzNjk4OGI3NjZmNmM2In19fQ==",
},
"Mightyena": {
	"name": "Mightyena",	"id": "4399cffe-4460-4f33-91f4-5ec173ebae9e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDc1NWRlODVjNmIzNzYyMDZmODAxMWY5Y2RmNTk0MTRhZGUyMDFmZTQzNDliZTBlYTE1YTc4OTdlNzAxNGZhIn19fQ==",
},
"Eevee": {
	"name": "Eevee",	"id": "c365f325-7a1b-415d-ab3b-5f77649eaf7f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTA0NGU5ZDE5YmVmNDc5MzNhZmY0MmJjZTRiNDU4ZjQzMTMxNTA5MGQ2MTNmNTRiNmU3OTVkYTU5ZGI5ZDBkZSJ9fX0=",
},
"Vulpix": {
	"name": "Vulpix",	"id": "93dafe17-9241-4b6f-9d68-6843905c3107",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTJiNzY0YTczMTdlOTAxYzdiZDhjMjQ4Y2QxMzg3ZTZhZjZiYzgzMzViODlkOTIzZjYxOGY4ZmViYmZiOTUifX19",
},
"Gengar": {
	"name": "Gengar",	"id": "5d267471-8d53-4903-9ce9-cb7882bc120b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTQyOGJjYjJhZDYyNTY3ZTFiZDBkNGRhYzZmNDczZmU5ZGUxNzVkYjExNzQyMjE0NGM0NjU3NWZmNWUxIn19fQ==",
},
"Raichu": {
	"name": "Raichu",	"id": "fc651254-c8a3-4a88-a730-363b3cf5bed5",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWJmNTIzZjJiZDkwYjNmZjE5NDQ1MTViNmEzMjQzMzhhYWQ0N2VhMWYyY2U5M2Y4MmQ1NTY0YzRjOWFkZTcxIn19fQ==",
},
"Beedrill": {
	"name": "Beedrill",	"id": "dc813fa8-0cfb-4a2b-8bf9-2da8deb0126a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWM0OGNhMWNlNDQ3YzFkYWEzOTliNGRlNjNiYjE5MDY2N2Y4ODdjYWY2ZTNlOGVkNTM3ZjA5MGE1ZmI2NGI4In19fQ==",
},
"Cubchoo": {
	"name": "Cubchoo",	"id": "e6fbccf7-e5ae-465a-aa3b-90a0b6c2abab",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTRmNDUxNTIzZGQ2NmM0ZTg5MmFlNTlhYTc5ZTlkZGNjNTI5MDQ1NDdmNWRmNWY2ODMxMDhkZGQ0MjJmZWMifX19",
},
"Bidoof": {
	"name": "Bidoof",	"id": "b0d512b4-11ca-4cd3-9874-9631f1afed51",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTdhNWU1MjE4M2U0MWIyOGRlNDFkOTAzODg4M2QzOTlkYzU4N2Q0ZWIyMzBlNjk2ZDhmNmJlNmQzZTU3Y2YifX19",
},
"Buizel": {
	"name": "Buizel",	"id": "d792a14a-edb2-4c71-9869-169d5df8ec60",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjQ0MDk3MmYxZGNiMjQ0ODcyZDJmMTAyNmRhY2ViOTRkYWRiOTg1MWNhNTkzMmUxNTE1NGZmZTdlM2JlOCJ9fX0=",
},
"Arceus": {
	"name": "Arceus",	"id": "3e01c6fc-4cd3-458c-a50d-7ea28960880e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvM2M3ZWFkZTcyNmIzOTFmN2YzYWI1ZDhiNWNmYzczNzY1NThiYWE4ODVkZTIyOWQ2ZGNiZDZiNjRlYzg5YWE3MCJ9fX0=",
},
"Flaaffy": {
	"name": "Flaaffy",	"id": "b66eed10-9d67-4af2-856a-87e329d6d6e3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmEyMTM3ZjM4NDRiMDMxNDMyZTMyMzYzMTdkNTU1M2ZiMjQ3ZWZlNzJlZTY4NmI4NTljZGNjNGYxOWUyYzMifX19",
},
"Deino": {
	"name": "Deino",	"id": "387728d7-07d0-4b3b-83f6-3fd18fa03914",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZmI5YTY3Yzc5MDVkMWFlN2M4NjUzZjZhNmU5ZjU0OTE5Zjg5MjZkMzY3MTQyM2E1ZmFmYWU2Yzk1YjkyOTgifX19",
},
"Muk": {
	"name": "Muk",	"id": "2a487180-e579-474b-a86c-65c84b1200bd",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWFlNTY4ZWU1OTc4MzQ5YWRjNjNhNWJmMzdmMDgyZWY1NTEyYmIyNjRjZGI3NTk4ZWZlY2Q3MWY0MmQxMyJ9fX0=",
},
"Oshawott": {
	"name": "Oshawott",	"id": "47679441-af19-4a4e-baaa-9b7089b66324",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjJiMWIzNmIyOTg1OTdjZGEyNmY3MjY1MmNhZjg0ZTBlN2RkZmFiNTRkZmY2ZjUyNTkzNzE3NDNlMjU4NSJ9fX0=",
},
"Cresselia": {
	"name": "Cresselia",	"id": "260d557e-cf7e-468a-bc1b-9b2e394784e3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMThjOGRhNWEyYTc3M2NlNGY1ZjUyOTY3NGMyZGY1MDVlNmZiOGU4NWQ3MTM5OWIxZjU2NjQwYmViMmZkZTcifX19",
},
"Yveltal": {
	"name": "Yveltal",	"id": "83f932e0-94b9-4f90-970d-bcffc2e36a46",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTVhZTY0Yzg3ZGU0NTFmZjExMjgyNTE0OTM1MzdlYWUzZWQ1MzYyOTgwYWFjZDU5MWNiNWUxMmI1Y2Y3YTI1NyJ9fX0=",
},
"Wailord": {
	"name": "Wailord",	"id": "2f0b35b5-b5c6-44da-b104-a7a20f08834d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDIxMTQyMTcyNDI0YjIxMGIxN2E5Y2EyZjQ0OWE0NDQ5NTE4NGFkZjgzYzk2NGQzODVmYTc1OGExMjAifX19",
},
"Moltres": {
	"name": "Moltres",	"id": "06b5b0a7-be85-45e3-b59d-2f66ed9fbd46",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmNmMDIyYTg5ZWYyMWZhZGEyNmQ5ZjY0OGUxNWNkZjQzZjJlZGI3NDk3MWY0NDIzY2ViNWFjNGEzNDNhNWYifX19",
},
"Mew": {
	"name": "Mew",	"id": "97423dfd-0a6b-4a69-96c6-2ee4211ef372",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzVjZDNjNzJkY2M3ZWVkY2ZmY2IyMjIxYjM4YjViOGFjNDcwNWZmZGM0NTc0NjFhODE2NTM4ODc0YjRjZiJ9fX0=",
},
"Zygarde": {
	"name": "Zygarde",	"id": "97717335-4adb-48b2-bf42-d6d99c5fab21",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNTA1NGEwMTlmNDVkN2FhNjE5ZGQ1YmUxZDRlNjhjNzljMGRmYWNiMjYwNjgxNDM5YzdiNDEzODY5YzhkYzcifX19",
},
"Zapdos": {
	"name": "Zapdos",	"id": "fc81facf-3201-47ef-ae9d-b2e22caea2e1",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDlhNjZmM2QyNThkOTI3ZjdlNDgxODE0OGJhYzY3YjIzZTc5MjRhOTNiODlmM2M5NmI4NzU0YmZjYjQ4Zjc1In19fQ==",
},
"Manaphy": {
	"name": "Manaphy",	"id": "9b425c4f-6fcd-4bea-a0b0-14f242a00754",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzcxZjJmMWQ1ZTRmZWFlNmY4OTM4MTZhOGNjNzg5MTU1MzY2NzQ3MjY0ZjlhMzZlZmM3MTNiYjhmOWMzZDYifX19",
},
"Koffing": {
	"name": "Koffing",	"id": "2054423f-284c-433e-9d80-fe9600e7ef29",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjE3NmRlYzQ5YTkzMTA5NmEwOWIyMmFkZDA0MDJhYjJjN2Y0ODk4NzcxMTA5MWQwMThlMDJiNGJiMWU1NyJ9fX0=",
},
"Omanyte": {
	"name": "Omanyte",	"id": "2c4d20aa-f0df-4c8e-9ae1-94dfd48c1ed2",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWM3MzhmY2I2OWM0OGVmNjBkNjU0ZGE0YzJjNDkzYzc1YjdjMjlmYmY4ZDgzNmJkZjVmOThiY2FiOGJhIn19fQ==",
},
"Cubone": {
	"name": "Cubone",	"id": "4d5eb419-f2e9-46fa-88b2-d5b49aedaef3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvN2E0ZmE3MWFkMjhjZDFlMWI3ZWE5MzU4MTczMDgyNWNiYTk2Y2FjM2NkM2IxYmM3MmE5N2VhNTRkZTUzNCJ9fX0=",
},
"Voltorb": {
	"name": "Voltorb",	"id": "9aa4abee-bee6-4770-811d-f8b02fa30b43",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTJmM2Y5Y2NhNzdjNzI1MjE3ZTQ1YWQ0ZWVlZWZmYTA1NjVmODJiODY2YWM2Nzk5OWI0M2MzYTk3MzExNjI4YyJ9fX0=",
},
"Electrode": {
	"name": "Electrode",	"id": "419b7cce-de74-41b4-a14c-67db879c74ff",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWVlZmUxMTkxNTc5OTU3YzgzMjUwYThjZThmZWZkNTVmNGQ3NmM1MGQ4MTA5NGM5MjA5ODk1ZjRiZDYwMCJ9fX0=",
},
"Weedle": {
	"name": "Weedle",	"id": "0b135f1f-8345-4f74-ad80-46f7e3bce3f3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjI5NjU5ZDExZTJkNGYzMGMzZTU5NDdhMWZjOTMyMWE4ZDljMTA1ZWQ3MmU5MjdhNTBjYjNlOGQ3MjkxNTMzIn19fQ==",
},
"Kakuna": {
	"name": "Kakuna",	"id": "c20f81a4-89dc-41a4-9384-6be0ea7abd02",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWE5YTgwMWYxMTljNjMxYTljOWZhMDQ3YTJjMjViYzBiNmNiZjkwODIzN2Q3NGNiMWE0MTA4NTEwN2M1OTcifX19",
},
"Elephant": {
	"name": "Elephant",	"id": "9a58e25a-cf47-447d-b13c-3ea36eccfa31",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzA3MWE3NmY2NjlkYjVlZDZkMzJiNDhiYjJkYmE1NWQ1MzE3ZDdmNDUyMjVjYjMyNjdlYzQzNWNmYTUxNCJ9fX0=",
},
"Keypad": {
	"name": "Keypad",	"id": "d54aa6ee-009c-4497-a8e8-31c85e26a019",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjAxYTU2OGViYTdlNDUzYjU1ZjE1NTQ1ZjVlMzVmZmFiODc5MWFhY2Y5MDM0YWZiYmJlNGJkZGIyMWZhNTAifX19",
},
"Honey_Pot": {
	"name": "Honey_Pot",	"id": "04182810-16ad-4491-ab70-ba4244488e7e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMThjMmNkZGVlZDYyNGE1MzhmMzQ5ZDhjNzAzNWZlZjkxOGU2ZDdhMTc4MTYzMWVhYzUxZWMxODI3MTJhNTRkYSJ9fX0=",
},
"Beehive": {
	"name": "Beehive",	"id": "aba20a14-035b-4794-b18c-b22ac6cc4477",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjAzNDJkYzljMmFkODg2YWNmZTNjYTJlOTg3YjdlMjhhODdjNzc0Y2E1ZjNkOGNiMmJmYWJlMTMxY2FmZTgifX19",
},
"Pepsi": {
	"name": "Pepsi",	"id": "92b6dbd7-11df-4702-b4d1-ec0dcc7ce114",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmJiYWU2ZGY5OWRjODJiZWFmNDlkMDY0ZGY3NGExYmJjMTVlOGUzNzY1MzMyNzY5MTJjOGM4ZmU1OWNiNGY0In19fQ==",
},
"Coca_Cola": {
	"name": "Coca_Cola",	"id": "8a145e5e-957d-418c-b000-511c971ae698",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTNiMDFmYjJmNmJhNDdjOWQ3NjM4NDkxZjM3Y2Q4NTgyYTkzNzczMTE4NmRmNGQxZWNjZDU5YjY1YmYzNyJ9fX0=",
},
"Sprite": {
	"name": "Sprite",	"id": "8b8c8496-88f0-4907-bbfc-5453a2333326",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjhhMzRkODZhN2JiMTNkNDVhZmRjNTBkM2RjZTVlZWQ5NWUxODQ0ZmJkZWUwY2NhNzUzYzZkMzM0NmUzMzllIn19fQ==",
},
"Mello_Yello": {
	"name": "Mello_Yello",	"id": "33edcc03-d380-4576-a070-cb2062044d28",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjg2YjUxZmIzMGI1MTM4YTQzNDRjYzNlNjM5N2RhMjhkZjM5NjI0MTM0MWJlOTIxMjFkNWJhZWVmOTk3ZmI0In19fQ==",
},
"Fanta": {
	"name": "Fanta",	"id": "d069bef7-f3a0-4ef8-9fa8-9829bb46094b",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmJlOTUwNWEzOGExNGQxNTEyYzc4OTJmYzQ0ZDNkN2NlNjMzOGIxYmYwZjkxMjM3MjFiMTIxYTE0YjA5NWEzIn19fQ==",
},
"Mountain_Dew": {
	"name": "Mountain_Dew",	"id": "ae986efc-25af-4ca3-8f87-c4ee7894b25e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODZlNWJmNjU3YWI4OTdhZDVlNTQ4NjdhNGMzYzJlNzFiMmRhMjRlNzUxOGIyZjgzNDQ4OGRhNzZmNjJmNTIxNiJ9fX0=",
},
"Netherlands": {
	"name": "Netherlands",	"id": "5ddfbff0-7173-48ec-82e6-73343e7fce0f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzIzY2YyMTBlZGVhMzk2ZjJmNWRmYmNlZDY5ODQ4NDM0ZjkzNDA0ZWVmZWFiZjU0YjIzYzA3M2IwOTBhZGYifX19",
},
"Norway": {
	"name": "Norway",	"id": "75648ac5-00c3-4d44-8cbd-0f5fc2b5fe2e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTA1OTZlMTY1ZWMzZjM4OWI1OWNmZGRhOTNkZDZlMzYzZTk3ZDljNjQ1NmU3YzJlMTIzOTczZmE2YzVmZGEifX19",
},
"Sweden": {
	"name": "Sweden",	"id": "7b797a5a-7ca2-4049-a637-c01dc139c2c7",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTkxMDkwNGJmZjljODZmNmVkNDc2ODhlOTQyOWMyNmU4ZDljNWQ1NzQzYmQzZWJiOGU2ZjUwNDBiZTE5Mjk5OCJ9fX0=",
},
"Egypt": {
	"name": "Egypt",	"id": "31f76680-6caf-4b98-806a-3c79dfebe51e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODI2ZTc0MmIzMmYwZjhkYjU5YzA3YjFiY2RkZTZmOGE5M2Y4NWM5MjllNTk4YzdlOTI3M2I5MjExZjJjZTc4In19fQ==",
},
"Chile": {
	"name": "Chile",	"id": "139fbc59-f696-486f-a124-d8890d13bdce",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWQxZGRkYzY2NTYxNGM5ZjY0ODdiYTljNjY2ZGE3NTc5NTYxNTg5YTQ5NGVmNzQ0YWFmOGY0Zjg4YTE2In19fQ==",
},
"Monaco": {
	"name": "Monaco",	"id": "d85773e9-b088-4f44-8eac-c955d46d46a1",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWRiMjY3OGNjYWJhNzkzNDQxMmNiOTdlZTE2ZDQxNjQ2M2EzOTI1NzRjNTkwNjM1MmYxOGRlYTQyODk1ZWUifX19",
},
"Canada": {
	"name": "Canada",	"id": "ec3a65b7-41d5-40cf-8a0b-0256d065a57d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjI0MWE2OTdmNmRmYjFjNTdjZGEzMjdiYWE2NzMyYTc4MjhjMzk4YmU0ZWJmZGJkMTY2YzIzMmJjYWUyYiJ9fX0=",
},
"United_States_of_America": {
	"name": "United_States_of_America",	"id": "a1495fae-beba-439d-825e-ae692eef70c6",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvN2QxNWQ1NjYyMDJhYzBlNzZjZDg5Nzc1OWRmNWQwMWMxMWY5OTFiZDQ2YzVjOWEwNDM1N2VhODllZTc1In19fQ==",
},
"Belgium": {
	"name": "Belgium",	"id": "936fbddc-df45-41ed-ae0f-c2f228f246fd",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWM3OGFhZTQyZWY5ZWU5ZmFhNjdiNjRiYjk3NGNlYTI3NWNlNzAyNjU1ZDM1Zjg0MWI2MDE3NDE2ZWUxYzM5MyJ9fX0=",
},
"Italy": {
	"name": "Italy",	"id": "caf1c8f6-f502-43c9-b460-badfbf68f042",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTU2YzVjYzE3MzE5YTZjOWVjODQ3MjUyZTRkMjc0NTUyZDk3ZGE5NWUxMDg1MDcyZGJhNDlkMTE3Y2YzIn19fQ==",
},
"England": {
	"name": "England",	"id": "d4c559ed-72c4-43bc-a775-a19cd470824a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmVlNWM4NTBhZmJiN2Q4ODQzMjY1YTE0NjIxMWFjOWM2MTVmNzMzZGNjNWE4ZTIxOTBlNWMyNDdkZWEzMiJ9fX0=",
},
"Romania": {
	"name": "Romania",	"id": "f07c2092-7bc1-47a2-9bf6-208d5574b00a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODRkMzgwYWE5ZDY2YTJhOTY2ZWIxY2ZjMTc2MDhmMjhmYmZlM2E3NWY2YTE4YThiZTU0NDY4MjU4NmM0MWM0In19fQ==",
},
"Germany": {
	"name": "Germany",	"id": "be211c23-d8aa-4119-bd0d-7f50fd115d9f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNWU3ODk5YjQ4MDY4NTg2OTdlMjgzZjA4NGQ5MTczZmU0ODc4ODY0NTM3NzQ2MjZiMjRiZDhjZmVjYzc3YjNmIn19fQ==",
},
"Singapore": {
	"name": "Singapore",	"id": "571aa975-8b65-4e35-a88a-7772eea50960",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGI1ZWQxMWY3OTdmM2ZjNjFlYWY4ZGFmYjZiZjMyMzRkMzFiOTZhYjc1OTZiZDJkZjcyMmQyZWYzNDczYzI3In19fQ==",
},
"North_Korea": {
	"name": "North_Korea",	"id": "cc50d132-6f5f-4305-b1c6-d7fefd737101",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMTk2OWQxMjY2MmZhZWJmYWNhNmY0YjA0NDJmY2IyNTFmZDYwYjYxYTlmY2RjZWVhMmJkYzIxZTAyNWViMjEifX19",
},
"France": {
	"name": "France",	"id": "4fe86bcb-fe6b-434e-a59f-ed60930991ab",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmEyNTI4N2QxMTQwZmIxNzQxZDRiNmY3ZTY1NjcyZjllNjRmZmZlODBlYTczNzFjN2YzZWM1YTZmMDQwMzkifX19",
},
"Speakers": {
	"name": "Speakers",	"id": "6b87c6e1-3cb7-4f9c-a98d-346bd75a6b21",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmU5OWY2Njk3MjVkMjM1ODYzNmFlMmY1YmMzNDM5ZDY2Nzg0OWRhYTg0NjJhZjkzYTQyZTIxMmFmMTJiMmEifX19",
},
"Blender": {
	"name": "Blender",	"id": "fa1f6b6a-6e39-40b9-b0b4-1b734eb87284",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTg2MzYxMjNiMWEzNzU1YWJkOGFlZjZkODViMmE4NWJmMTBmNDg2ZWRlZmRkMWEzY2VmNzY3OWQ4MjUifX19",
},
"Doge": {
	"name": "Doge",	"id": "11ca9402-ec89-4708-b4cb-57e72006a739",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjlhZmIyZTVmMGI5NzdjNGM2ODNlMDE3ZDJiNDdmY2QxNDg4YWI1NjM5Nzc2NmU1YjM4MDQwNWExMzkyNjAifX19",
},
"Stack_of_Books": {
	"name": "Stack_of_Books",	"id": "e056ebd9-3277-47d4-9a7c-87dfabd13ed3",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODJhZTE5MTA3MDg2ZGQzMTRkYWYzMWQ4NjYxOGU1MTk0OGE2ZTNlMjBkOTZkY2ExN2QyMWIyNWQ0MmQyYjI0In19fQ==",
},
"Stack_of_Books_2": {
	"name": "Stack_of_Books_2",	"id": "d93fd71a-94fa-479b-8d8e-8bfb601a8df2",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjQ5MzkzNjU0NGNhMjkxYjlmYzc5Mjg2NjNhZTI3NjNlMTgzNTc1NmFhMWIzOTUyZjk2NWQ1MjVjMzkzN2I1ZCJ9fX0=",
},
"Fish_Tank": {
	"name": "Fish_Tank",	"id": "afcf2ba0-0405-428f-b727-c4acdda0dc75",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGNlOGZkYTEzMDNiNWIzMjM5Yjk2ZWZiYTM5NWY2MjcxN2NjODc4NWJlMzJlMWQ4ODlhZmU2Yjk3YmIxYzFhIn19fQ==",
},
"Tomato_2": {
	"name": "Tomato_2",	"id": "05635a92-c9f7-4a61-8a41-bdabcccd0d87",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDE4Njg2M2ZkZjNmM2UyOTc5ZWM2ZDk3OGEwODhkOGE0Zjg2NjRjNTBiNWI2ZDI5YWQ0YTdhYzI2NGEwMTcifX19",
},
"Ripe_Tomato": {
	"name": "Ripe_Tomato",	"id": "95f00fa3-8faa-466d-8a62-dc373a28a18c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjkxNDcxNzIwNzJmMDcyNDgzNTI5NzY3ZmU0NzU1NGE5NWEwZTBmZDliNmNjNTMxYjI1OTU4YTM5OWVmMyJ9fX0=",
},
"Raspberry": {
	"name": "Raspberry",	"id": "f4e64e08-a19c-48db-aabb-521f571f89ed",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNDg3YmRlN2NiNjYxOGJlMWMxYzkwM2Y2ODc1ZWE5NzZlNTczMzU0NDI0OGZkNTA1ZjUxNmExOGYyOTIzNSJ9fX0=",
},
"Raspberry_2": {
	"name": "Raspberry_2",	"id": "1508fef4-f03b-483c-9c61-94efbeae203c",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjEyZWYxYjQ4NmU5N2U0Y2IxMjRhYTc2MjlhY2ViOTFlZGM1MWQ2MzMzOGM5MWEwMTI4ODU0OTNjNWQ5YyJ9fX0=",
},
"Apple_2": {
	"name": "Apple_2",	"id": "27ff2d9d-5cc7-40d7-955a-6ac84b7aa6da",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2M5ZWJhNjNhOWQxMmNiNmZkZTYzYmFkYmUyODlkODg4ZjU3MjE5ZjQxMjJjMjgyMGVhNjU0ZmJlNjM1MGE1In19fQ==",
},
"Apple_3": {
	"name": "Apple_3",	"id": "1f5ef611-dcfc-4719-8df5-36aa26a02f33",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODU2NDc5N2NkNjI2NjQ0NDhlZDAyOGU0ODdhY2Q5NWQ1NzA3NWRjZTQ5YTM1NmZjYzY1NjU1YjJiNTI1ZGRiIn19fQ==",
},
"Apple_4": {
	"name": "Apple_4",	"id": "ebd81954-37b1-49f4-aaa1-8e79e2e3a856",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjNlODY1OTQ3OGRkMjhiMWFkZTZlYmU3ZDNlMWQ2NzU4ZTIxOWY0MzhkYjc4NGE1YWRkZWRhODZlZDFhMzhhIn19fQ==",
},
"Apple_5": {
	"name": "Apple_5",	"id": "686e76dd-66c2-497a-bef9-731e1d558d62",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmZiMGUyMjFmZDgxYjk4YjhiNTY5YjM1MjJkNTIzMWNmOGIzNjc3MzJmMzdiMzgxZTdhY2VhMjlhNmU4NCJ9fX0=",
},
"Apple_6": {
	"name": "Apple_6",	"id": "0d5fd9c3-d044-478f-b774-d37b5f86fa2a",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTJiMzViZGE1ZWJkZjEzNWY0ZTcxY2U0OTcyNmZiZWM1NzM5ZjBhZGVkZjAxYzUxOWUyYWVhN2Y1MTk1MWVhMiJ9fX0=",
},
"Goomba_2": {
	"name": "Goomba_2",	"id": "ba96c92d-1b08-4fd1-b0e5-39aab40215b7",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWVjZjk0ZjRiY2JiZjZlYWRjYjI1YWEzZDA2OWFhNjc4ZWJkYjUyNDFlYjgyZThlMjY4ODljYWYzMjc1NTcwIn19fQ==",
},
"Furby": {
	"name": "Furby",	"id": "742b729b-a919-4bc8-948d-fa2afdbc7067",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvN2JmZjUyNzU2Mjg4OWUxNmE1NDRmMmY5OTZmYmEzZDk1NDFkMGFhY2Y4MTQ2MmJmZmM5ZmI1Y2FkOGFlZGQ1In19fQ==",
},
"Present_4": {
	"name": "Present_4",	"id": "7744f4b0-9aa1-4984-80f1-a5068e1a7fe2",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYmQ3YTlmNmVkMDhkZDIxN2ZkZjA5ZjQ2NTJiZjZiN2FmNjIxZTFkNWY4OTYzNjA1MzQ5ZGE3Mzk5OGE0NDMifX19",
},
"Present_5": {
	"name": "Present_5",	"id": "49c8ac24-641a-4f81-a394-1a55c732883e",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjRhYmU4MWU2ZjQ5NjFlMGY2YmQ4MmYyZDQxMzViNmI1ZmM4NDU3MzllNzFjZmUzYjg5NDM1MzFkOTIxZSJ9fX0=",
},
"CD_Case": {
	"name": "CD_Case",	"id": "5e1d7e1e-ec26-4336-a39a-4013324bf1cb",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzI0MTI1NDhlYmQ2ODk3ZTgwOGMxZmNiYmY1YmY3YTYyNWZlMTVmYTQ4ZmJmZjRjZjgyMmIwYzhlNTdhOCJ9fX0=",
},
"Cooked_Shrimp": {
	"name": "Cooked_Shrimp",	"id": "ae633b72-0781-4f3a-ad85-9b13e679146d",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzM2YTlhZGQyNTY0NWJmY2MzNzdjMjVlZjBjMmU5OTAxZDE5NDkzYzNlOTgxZWJjNmJhN2ExYTFiNjQ2NmNlNCJ9fX0=",
},
"Sushi_Salmon_2": {
	"name": "Sushi_Salmon_2",	"id": "56810a43-92a9-4974-8693-48ace62881ff",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYWU5ZDIyZDlhZGE2M2UyODE0MjBhZTMzNjkxODgwODY5ZmExYTE0YmZkZjg3ZDhlNTM4ZTk5OGE4ZjI5NTk1YiJ9fX0=",
},
"Sushi": {
	"name": "Sushi",	"id": "4da18ebf-55b8-4d15-ae02-836bb789d377",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvY2I4MmQzYzllZWRjNzE4YzA3NTE5MjU0Zjc5MjFhNTlmZjNhNmYyNDU5Mzk2NjVjOWNiMDE3MTEyY2U2NzAifX19",
},
"Sushi_2": {
	"name": "Sushi_2",	"id": "32955d19-a051-49b8-8727-35f094d00806",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMjNjYTNmOTI2ZTdhOWFiOTU1NWZlY2I2OWE4MDI3NDNjMTIyZDllZmM1NjVhMmZlNTU0NTExOGZhOTFkMSJ9fX0=",
},
"Crown": {
	"name": "Crown",	"id": "35445ad8-2d16-4bb6-a15b-e356de352a16",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzJiYWYwYzU4OWE2YjU4MzUxMWQ4M2MyNjgyNDA4NDJkMzM2NDc3NGVjOWY1NjZkMWZkNGQzNDljZjQyZmIifX19",
},
"Emerald_Steve_Head": {
	"name": "Emerald_Steve_Head",	"id": "402b5ce0-6d9c-48ff-ad75-a8dc79bb9705",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjViNjU2ZGE2NjZkMjc1OWU4MTk1NjQyMTQyZTExOWU2NTg1ODUyYzY2MTllMmFkNzlhZTJhZDE4MTQ2NSJ9fX0=",
},
"Plastic_Cup": {
	"name": "Plastic_Cup",	"id": "2ff72ac6-61ea-43d8-b1a6-499ffcc6be5f",	"value": "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTE3OWNlNDg0OTcyMzQzNGU4NDc0N2VjODVmYmJmYjExMjE0NTZjOGFlYjJlOTE3MWZiODMyODkyMWQ0NSJ9fX0=",
},

};
//
