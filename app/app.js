const myFormApp = angular.module("myFormApp", ["ngRoute"]);

// Config method is a function
// That will run before your app runs
myFormApp.config([
  "$routeProvider",
  function($routeProvider) {
    $routeProvider
      .when("/home", {
        templateUrl: "views/home.html",
        controller: "FormController"
      })
      .when("/forms/:title", {
        templateUrl: "views/formIndex.html",
        controller: "FormIndexController"
      })
      .otherwise({
        redirectTo: "/home"
      });
  }
]);

// Service for passing data between controllers
myFormApp.factory("indexService", function() {
  let index;

  // Assign index of clicked element to 'index' variable
  const passIndex = function(newIndex) {
    index = newIndex;
  };

  // Return index variable
  const getIndex = function() {
    return index;
  };

  return {
    passIndex: passIndex,
    getIndex: getIndex
  };
});

// Controller of formIndex view
myFormApp.controller("FormIndexController", [
  "$scope",
  "indexService",
  function($scope, indexService) {
    // Load form details to the view
    $scope.formDetails = function() {
      // Get index variable from service
      let index = indexService.getIndex();
      // Save 'index' variable to the localStorage and
      // Get data from localStorage with 'index' variable
      if (index !== undefined) {
        localStorage.setItem("indexes", JSON.stringify(index));
        let indexForm = JSON.parse(localStorage.getItem("forms"))[index];
        $scope.indexForm = indexForm;
      } else {
        // To display content on page refresh get the index from localStorage and
        // Use it to fetch data from localStorage
        let formNumber = JSON.parse(localStorage.getItem("indexes"));
        let indexForm = JSON.parse(localStorage.getItem("forms"))[formNumber];
        $scope.indexForm = indexForm;
      }
    };

    // Check for input value to change input type
    $scope.changeInputType = function() {
      // ADD EVENT LISTENER TO NAME
      document.getElementById("name").addEventListener("input", checkNameType);
      // ADD EVENT LISTENER TO SURNAME
      document
        .getElementById("surname")
        .addEventListener("input", checkSurnameType);
      // ADD EVENT LISTENER TO AGE
      document.getElementById("age").addEventListener("input", checkAgeType);

      // Check for name value
      // Regex used here to check the condition of
      // If input value only includes numbers
      function checkNameType() {
        if (/^\d+$/.test(this.value)) {
          this.getAttribute("type");
          this.setAttribute("type", "number");
        } else {
          this.getAttribute("type");
          this.setAttribute("type", "text");
        }
      }

      // Check for surname value
      // Regex used here to check the condition of
      // If input value only includes numbers
      function checkSurnameType() {
        if (/^\d+$/.test(this.value)) {
          this.getAttribute("type");
          this.setAttribute("type", "number");
        } else {
          this.getAttribute("type");
          this.setAttribute("type", "text");
        }
      }

      // Check for age value
      // Regex used here to check the condition of
      // If input value only includes numbers
      function checkAgeType() {
        if (/^\d+$/.test(this.value)) {
          this.getAttribute("type");
          this.setAttribute("type", "number");
        } else {
          this.getAttribute("type");
          this.setAttribute("type", "text");
        }
      }
    };
    $scope.formDetails();
    $scope.changeInputType();
  }
]);

// Controller of home view
myFormApp.controller("FormController", [
  "$scope",
  "$http",
  "$filter",
  "$location",
  "indexService",
  function($scope, $http, $filter, $location, indexService) {
    // ADD NEW FORM
    $scope.addForm = function() {
      // Get date data
      let dateText = document.querySelector(".date-text").textContent;
      // Push date date to $scope.forms
      $scope.forms.push({
        name: $scope.modal.title,
        description: $scope.modal.desc,
        createdAt: dateText,
        fields: [
          {
            required: true,
            name: $scope.modal.name,
            dataType: "STRING"
          },
          {
            required: true,
            name: $scope.modal.surname,
            dataType: "STRING"
          },
          {
            required: false,
            name: $scope.modal.age,
            dataType: "NUMBER"
          }
        ]
      });

      // Get forms from localStorage
      let localForms = JSON.parse(localStorage.getItem("forms"));
      // Add last added form to the localForms
      localForms.push($scope.forms[$scope.forms.length - 1]);
      // Save localForms to the localStorage
      localStorage.setItem("forms", JSON.stringify(localForms));
    };

    // CLEAR INPUT FIELDS WHEN CREATING NEW FORM
    $scope.clearFields = function() {
      $scope.modal = {};
    };

    // GET DATE
    $scope.date = new Date();

    // LOAD FORMS TO THE VIEW
    $scope.loadForms = function() {
      // If there is no item in localStorage
      // Get forms.json file and save it to localStorage and
      // Get 'forms' data from localStorage, assign it to the $scope.forms
      if (localStorage.getItem("forms") === null) {
        $http.get("data/forms.json").then(function(data) {
          localStorage.setItem("forms", JSON.stringify(data.data));
          let retrievedForms = localStorage.getItem("forms");
          $scope.forms = JSON.parse(retrievedForms);
        });
      } else {
        // Else, if there is a item in localStorage
        // Get 'forms' data from localStorage
        // Assign it to the $scope.forms
        let retrievedForms = localStorage.getItem("forms");
        $scope.forms = JSON.parse(retrievedForms);
      }
    };

    $scope.loadForms();

    // PASS FORM INDEX TO THE INDEX CONTROLLER
    $scope.callToPassIndex = $scope.handleIndex = function(form) {
      // Get clicked item's index
      let index = $scope.forms.indexOf(form);
      // Pass it to the service
      indexService.passIndex(index);
    };

    // REDIRECT TO FORM INDEX
    $scope.go = function(title) {
      $location.path("forms" + "/" + title);
    };
  }
]);
