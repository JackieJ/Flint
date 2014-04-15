var matchApp = angular.module('Match', ['goangular', 'ngAnimate', 'angularSlideables', 'firebase']);

matchApp.config(function($goConnectionProvider) {
  $goConnectionProvider.$set('https://goinstant.net/469216b0e2ee/Flint');
});

matchApp.controller('MatchCtrl', function($scope, $goKey, $firebase, $firebaseSimpleLogin, $goUsers, $goConnection, $window) {

  var ref = new Firebase("https://flint.firebaseio.com/");
  $scope.auth = $firebaseSimpleLogin(ref);
  $scope.auth.$getCurrentUser().then(function(user) {
    $scope.user = $goKey('users/' + user.id);
    $scope.user.$sync();
    $scope.user.$on('ready', function() {
      $scope.user.$set("active");
      console.log("User is active!");
    });
    $window.onbeforeunload = function() {
      $scope.user.$remove().then(function ( ) {
        console.log("User Removed!");
      });
    };
  });

  $scope.auth.$getCurrentUser().then(function(user) {
    $scope.users = $goKey('users');
    $scope.users.$sync();
    $scope.users.$on("ready", function() {
      $scope.counter = $goKey('counter');
      $scope.counter.$sync();

      $scope.counter.$on('ready', function() {
        // Pick Random Active User
        $scope.users.$$key.get(function (err, result) {
          var keys = Object.keys(result)
          keys.splice(keys.indexOf(user.id), 1);
        $scope.mateId = keys[ keys.length * Math.random() << 0];
        });
        var room = $scope.counter.$value + 1;
        $scope.counter.$set(room);

        $scope.userAcc = $goKey('accounts/' + user.id + '/matches/' + room + '/mateId');
        $scope.userAcc.$sync();
        $scope.userAcc.$on("ready", function() {
          $scope.userAcc.$set($scope.mateId).then(function() {

            $scope.mateAcc = $goKey('accounts/' + $scope.mateId + '/matches/' + room + '/mateId');
            $scope.mateAcc.$sync();
            $scope.mateAcc.$on("ready", function() {
              $scope.mateAcc.$set(user.id).then(function() {
                document.location.href = "/chat?room=" + room;
              });
            });

          });
          console.log("Set")
        });

      });

    });
  }); // End getCurrentUser

}); // End Controller
