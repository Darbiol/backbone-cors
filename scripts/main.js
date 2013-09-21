(function ($, BB, _) {

	$('#add_contact').tooltip();

	var App = Backbone.View.extend({
		el: "#contacts",
		events: {
			'click #add_contact': 'addPerson',
			'click .edit' : 'editPerson',
			'click .done' : 'editDone',
		},
		initialize: function () {
			this.input_name = $('#inputs input[name=fullname]');
			this.input_number = $('#inputs input[name=number]');
			this.input_username = $('#inputs input[name=username]');
			this.contacts_list = $('.table tbody');

			this.listenTo(this.collection, 'add', this.createView);
			this.collection.fetch()
			this.listenTo(this.collection, 'destroy', this.deletePerson);
		},

		addPerson: function (evt) {
			console.log('addPerson');
			var person = new PersonModel({
				name: this.input_name.val(),
				number: this.input_number.val(),
				username: this.input_username.val()
			});

			this.collection.add(person);
			person.unset('position');
			person.save({validate:true});
			this.clearFields();
		},
		createView: function(model){
			console.log("createView");
			model.set("position", this.collection.indexOf(model)+1, {validate:true});
			var view = new PersonView({model: model});
			this.contacts_list.append(view.render().el);	
		},
		clearFields: function(){
			this.input_name.val('');
			this.input_number.val('');
			this.input_username.val('');
		},
		editDone: function(evt){
		},
		deletePerson: function(evt){
		}
	});

	var PersonModel = Backbone.Model.extend({
		idAttribute: "_id",
		url: 'http:/localhost:9090/contacts',
		urlRoot: 'http:/localhost:9090/contacts',
		defaults: {
			'name': '-',
			'number': '-',
			'username': '-'
		},
		initialize: function () {
			this.on("invalid", function (model, error){
				alert(error);
			});
		},
		validate: function(attr, options){
			if(attr.name =="" || attr.number=="" || attr.name==""){
				return "no fields must be empty!";
			}/*if(_.findWhere(this.collection.toJSON(), {username:"Darbiol"})){
				return "Username Already Exists!";
			}*/
		}
	});



	var PersonCollection = Backbone.Collection.extend({
		model: PersonModel,
		url: 'http:/localhost:9090/contacts',
		initialize: function () {

		}
	});


	var PersonView = Backbone.View.extend({
		tagName: 'tr id="person"',
		template: _.template($('#contact_template').html()),
		swapTemplate: _.template($('#edit_mode_template').html()),
		events:{
			'click .delete' : 'removeContact',
			'click .edit' 	: 'editContact',
			'click .done'	: 'saveEdit',
			'click .cancel' : 'cancelEdit'
		},
		initialize: function() {
			 this.listenTo(this.model, 'destroy', this.remove);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		removeContact: function(){
			this.model.destroy({"url":this.model.url+'/'+this.model.id});
		},
		editContact: function(){
			this.$el.html(this.swapTemplate(this.model.toJSON()));
			this.$el.find('input[name="fullname"]').focus();
		},
		cancelEdit: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		saveEdit: function(){
			this.model.url = this.model.url + '/' + this.model.id;
			this.input_name=$('#person input[name=fullname]');
			this.input_number=$('#person input[name=number]');
			this.input_username=$('#person input[name=username]');
			this.model.set({"name":this.input_name.val(), "number":this.input_number.val(), "username":this.input_username.val()});
			this.model.save();
			this.$el.html(this.template(this.model.toJSON()));
		}

	});

	var contactApp = new App({collection: new PersonCollection()});



})(jQuery, Backbone, _)