/* global angular */

(function () {
	var app = angular.module('app', []);

	app.directive('userEntry', function() {
		return {
			restrict: 'E', // E -> Represent an Element
			templateUrl: 'user-entry.html'
		};
	});

	app.directive('menuHeader', function() {
		return {
			restrict: 'E', // E -> Represent an Element
			templateUrl: 'menu-header.html'
		};
	});

	app.directive('addUserModal', function() {
		return {
			restrict: 'E', // E -> Represent an Element
			templateUrl: 'add-user-modal.html'
		};
	});

	app.directive('editUserModal', function() {
		return {
			restrict: 'E', // E -> Represent an Element
			templateUrl: 'edit-user-modal.html'
		};
	});

	app.directive('deleteUserModal', function() {
		return {
			restrict: 'E', // E -> Represent an Element
			templateUrl: 'delete-user-modal.html'
		};
	});


	// Loading the products from some API using service $http
	// Exists a lot of different services, and methods of $http,
	// like: POST, DELETE, ...
	app.controller('PlatformController', [ '$http', '$scope', function($http, $scope)
	{
		var platform = this;
        platform.users = [];
		platform.currUser = "";
		platform.editUser = "";
		platform.file = "";

		$scope.loadUserList = function()
		{
			$http.get('http://localhost:3000/api/users').
			success(function(data) {
	            platform.users = data;
			});
		}

		$scope.loadUser = function(id)
		{
			$http.get('http://localhost:3000/api/users/' + id, {"id" : id}).
			success(function(data) {
	            platform.users.push(data);
			});
		}

		$scope.onFileSet = function(files)
		{
			var fd = new FormData();
			fd.append("file", files[0]);
			platform.file = fd;
		}

		this.setUser = function(user)
		{
			platform.currUser = user;
			platform.editUser = user;
		}

		this.addUser = function(user)
		{
			var file = platform.file;
			var userJson =
			{
				"name" : user.name,
				"age" : user.age,
			}

			$http.post('http://localhost:3000/api/users', userJson)
			.success(function(response) {
				alert(response.id);

				// Send the photo
				$http.post('http://localhost:3000/api/users/photo/' + response.id, file,
				{
		            transformRequest: angular.identity,
		            headers: {'Content-Type': undefined}
		        })
				.success(function() {
					alert("User added!");

					$scope.loadUser(response.id);
				})
				.error(function() {
					alert("Failed to add a user.");
				});
			})
			.error(function() {
				alert("Failed to add a user.");
			});
		}

		this.deleteUser = function(user)
		{

			$http.delete('http://localhost:3000/api/users/' + user._id, {"id" : user._id}).
			success(function() {
				alert("User deleted!");

				// Update list
				var i = platform.users.indexOf(user);
				platform.users.splice(i, 1);
			})
			.error(function() {
				alert("Failed to delete user.");
			});
		}

		this.updateUser = function(user)
		{
			var file = platform.file;

			console.log(user);

			$http.put('http://localhost:3000/api/users/' + user._id, user).
			success(function() {

				// Send the photo
				$http.post('http://localhost:3000/api/users/photo/' + user._id, file,
				{
		            transformRequest: angular.identity,
		            headers: {'Content-Type': undefined}
		        })
				.success(function() {
					$scope.loadUserList();

					alert("User updated!");
				})
				.error(function() {
					alert("Failed to update user.");
				});
			})
			.error(function() {
				alert("Failed to update user");
			});
		}

		$scope.loadUserList();

	}]);

})();
