(function () {
    'use strict';

  /**
   * @ngdoc object
   * @name admin.recruitment.controller:RecruitmentCtrl
   *
   * @description
   *
   */

    function RecruitmentCtrl ($scope, $http) {

        $scope.formData = {};
        $scope.formFields = [
         {
        key: 'classType',
        type: 'select',
        label: 'Class Needed',
        name: 'Class Needed',
        options: [
          {
            'name':'Death Knight',
            'value': 'deathknight',
            'image': 'assets/images/icons/icon_class_death_knight.png'
          },
          {
            'name':'Druid',
            'value': 'druid',
            'image': 'assets/images/icons/icon_class_druid.png'
          },
          {
            'name':'Hunter',
            'value': 'hunter',
            'image': 'assets/images/icons/icon_class_hunter.png'
          },
          {
            'name':'Mage',
            'value': 'mage',
            'image': 'assets/images/icons/icon_class_mage.png'
          },
          {
            'name':'Monk',
            'value': 'monk',
            'image': 'assets/images/icons/icon_class_monk.png'
          },
          {
            'name':'Paladin',
            'value': 'paladin',
            'image': 'assets/images/icons/icon_class_paladin.png'
          },
          {
            'name':'Priest',
            'value': 'priest',
            'image': 'assets/images/icons/icon_class_priest.png'
          },
          {
            'name':'Rogue',
            'value':'rogue',
            'image': 'assets/images/icons/icon_class_rogue.png'
          },
          {
            'name':'Shaman',
            'value':'shaman',
            'image': 'assets/images/icons/icon_class_shaman.png'
          },
          {
            'name':'Warlock',
            'value':'warlock',
            'image': 'assets/images/icons/icon_class_warlock.png'
          },
          {
            'name':'Warrior',
            'value':'warrior',
            'image': 'assets/images/icons/icon_class_warrior.png'
          }]
       },
       {
        key:'classSpec',
        type:'select',
        label:'Desired Spec',
        options: [
            {value: 'affliction', name: 'Affliction'},
            {value: 'arcane', name: 'Arcane'},
            {value: 'arms', name:'Arms'},
            {value: 'assassination', name:'Assasination'},
            {value: 'balance', name: 'Balance'},
            {value: 'beastmaster', name:'Beast Mastery'},
            {value: 'blood', name:'Blood'},
            {value: 'brewmaster', name: 'Brewmaster'},
            {value: 'combat', name:'Combat'},
            {value: 'demonology', name:'Demonology'},
            {value: 'destruction', name:'Destruction'},
            {value: 'discipline', name:'Discipline'},
            {value: 'elemental', name:'Elemental'},
            {value: 'enhancement', name:'Enhancement'},
            {value: 'feral', name: 'Feral'},
            {value: 'fire', name:'Fire'},
            {value: 'frost', name: 'Frost'},
            {value: 'fury', name: 'Fury'},
            {value: 'guardian', name:'Guardian'},
            {value: 'holy', name:'Holy'},
            {value: 'marksman', name: 'Marksman'},
            {value: 'mistweaver', name:'Mistweaver'},
            {value: 'protection', name:'Protection'},
            {value: 'restoration', name:'Restoration'},
            {value: 'retribution', name:'Retribution'},
            {value: 'shadow', name:'Shadow'},
            {value: 'subtlety', name:'Subtlety'},
            {value: 'survival', name:'Survival'},
            {value: 'unholy', name:'Unholy'},
            {value:'windwalker', name:'Windwalker'}
        ]
       },

          {
              key: 'priority',
              type: 'select',
              Label: 'Priority',
              options: [
              {
                'name':'Low',
                'value':'low'
              },
              {
                'name':'Medium',
                'value':'medium'
              },
              {
                'name':'High',
                'value':'high'
              }
              ]
          },

          {
            key:'status',
            label:'Status',
            type:'select',
            options: [
            {
              'name':'Open',
              'value':'open'
            },
            {
              'name':'Closed',
              'value':'closed'
            }
            ]
          }
      ];

        $scope.formOptions = {
          //Set the id of the form
          uniqueFormId: 'recruitment'
      };
        $scope.onSubmit = function() {
          $http.post('/api/recruitment', $scope.formData);
          console.log('recruitment status submitted:', $scope.formData);
      };
    }
    angular
        .module('topshelf.admin')
        .controller('RecruitmentCtrl', RecruitmentCtrl);
})();
