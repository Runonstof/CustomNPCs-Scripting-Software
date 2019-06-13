@block init_event
	(function(e){
		var data = e.block.getStoreddata();
        if(data.has("model")){
            var dataParts = data.split("|");
            e.block.setModel(dataParts[0]);
            if(dataParts[1])
                e.block.getModel().setItemDamage(dataParts[1]);
        }
	})(e);
@endblock
