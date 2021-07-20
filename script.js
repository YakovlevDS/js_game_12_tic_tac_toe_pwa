function TicTacToe (res_ctrl, res_info, res_input, game_mode_ctrl,
                    choose_ctrl, choose_sign, game_ctrl, grid_ctrl, info_ctrl ) {
  /* variables */
  this.var = {};
  this.var.current  = undefined;
  this.var.cpu_ctrl = undefined;
  this.var.sign     = [];
  this.var.disabled = 0;
  
  /* objects */
  this.obj = {};
  this.obj.res_score  = [ $($($(res_info)[0]).children ('div')[0]), $($($(res_info)[1]).children ('div')[0]) ];
  this.obj.res_player = [ $($(res_input)[0]), $($(res_input)[1]) ];
  this.obj.choose     = $(choose_ctrl);
  this.obj.sign       = [ $($(choose_sign)[0]), $($(choose_sign)[1]) ];
  this.obj.reset_all  = $($(game_mode_ctrl)[0]);
  this.obj.info       = $(info_ctrl);
  this.obj.mode_ctrl  = [ $($(game_mode_ctrl)[1]), $($(game_mode_ctrl)[2]) ];
  this.obj.game_mode  = [ $($(game_mode_ctrl + " div")[1]), $($(game_mode_ctrl + " div")[2]) ];
  this.obj.game       = $(game_ctrl);
  this.obj.cell       = [];
  
  for ( var j = 0; j < 9; j++ )
        this.obj.cell.push ($($(grid_ctrl)[j]));
  
  /* functions */
  var self = this;
  
  this.choose_type = function (even) {
      self.var.cpu_ctrl = $(this).data ('vs') == 'cpu';
      
      if ( self.var.cpu_ctrl ) {
           var icon = self.obj.res_score[1].children ().children ('.glyphicon');
           
           icon.removeClass ('glyphicon-user');
           icon.addClass ('glyphicon-oil');
           self.obj.res_player[1].val ("CPU");
      }
    
      self.obj.mode_ctrl[0].hide ('fade', 400);
      self.obj.mode_ctrl[1].hide ('fade', 400);
      setTimeout (function () {
        self.obj.choose.show ('fade', 500);
        self.obj.reset_all.show ('fade', 500);
      }, 500);
  };
  
  this.choose_sign = function () {
      self.var.sign[0] = $(this).data ('sign');
      if ( self.var.sign[0] == 'X' )  
           self.var.sign[1] = 'O';
      else self.var.sign[1] = 'X';
    
      self.obj.choose.hide ('fade', 400);
      self.obj.reset_all.hide ('fade', 400);
      setTimeout (function () {
        self.var.current = Math.round (Math.random ());
        self.obj.res_player[self.var.current].parent ().addClass ('current-player');
        
        if ( self.var.current == 1 && self.var.cpu_ctrl )
             self.cpu_turn ();
        
        
        self.obj.game.show ('fade', 500);
        self.obj.reset_all.show ('fade', 500);
      }, 500);
  };
  
  this.reset = function () {
      self.obj.choose.hide ('fade', 400);
      self.obj.game.hide ('fade', 400);
      self.obj.res_player[0].val ("Player1");
      self.obj.res_player[1].val ("Player2");
      self.obj.reset_all.hide ('fade', 400);
    
      var icon = self.obj.res_score[1].children ().children ('.glyphicon');

      icon.removeClass ('glyphicon-user');
      icon.removeClass ('glyphicon-oil');
      icon.addClass ('glyphicon-user');
    
      self.var.current  = undefined;
      self.var.cpu_ctrl = undefined;
      self.var.sign     = [];
      self.var.disabled = 0;
      
      self.obj.res_player[0].parent ().removeClass ('current-player');
      self.obj.res_player[1].parent ().removeClass ('current-player');
      self.obj.res_score[0].text ("0");
      self.obj.res_score[1].text ("0");
      
      for ( var j = 0; j < 9; j++ ) {
            self.obj.cell[j].text ("");
            self.obj.cell[j].removeClass ('game-cell-disable');
      }
    
      setTimeout (function () {
        self.obj.mode_ctrl[0].show ('fade', 500);
        self.obj.mode_ctrl[1].show ('fade', 500);
      }, 500);
  };
  
  this.cpu_turn = function () {
    var enemy_pos = [];
    var free_pos = [];
    var cpu_pos = [];
    var j = 0;

    for ( j = 0; j < 9; j++ ) {
          if ( self.obj.cell[j].text () == self.var.sign[0] ) 
               enemy_pos.push (j);
          
          if ( self.obj.cell[j].text () == self.var.sign[1] )
               cpu_pos.push (j);
      
          if ( self.obj.cell[j].text () == "" )
               free_pos.push (j);
    }
    
    if ( free_pos.length < 1 )
         return;
    
    if ( self.var.disabled < 2 ) {
         Array.prototype.diff = function(arr) {
           return this.filter(function(val) {return arr.indexOf (val) < 0;});
         };
      
         var start_move = [ 0, 2, 4, 6, 8 ].diff (enemy_pos);
         var check_pos = Math.round (Math.random () * (start_move.length - 1));
      
         self.obj.cell[start_move[check_pos]].text (self.var.sign[1]);
         self.obj.cell[start_move[check_pos]].addClass ('game-cell-disable');
      
         self.var.disabled++;
         self.change_player ();
         return;
    }
    
    var warning   = [ [0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8], // H
                      [0, 3], [3, 6], [1, 4], [4, 7], [2, 5], [5, 8], // V
                      [0, 4], [4, 8], [2, 4], [4, 6],                 // D
                      [0, 2], [3, 5], [6, 8], [0, 6], [1, 7], [2, 8], // H+V +1
                      [0, 8], [2, 6] ];                               // D   +1
    var solution  = [ 2, 0, 5, 3, 8, 6, 6, 0, 7, 1, 8, 2, 8, 0, 6, 2, 1, 4, 7, 3, 4, 5, 4, 4 ];
    var threat   = [];
    
    for ( j in warning ) {
          if ( free_pos.indexOf (solution[j]) != -1 ) {
               if ( cpu_pos.indexOf (warning[j][0]) != -1 && cpu_pos.indexOf (warning[j][1]) != -1 ) {
                    self.obj.cell[solution[j]].text (self.var.sign[1]);
                    self.obj.cell[solution[j]].addClass ('game-cell-disable');
               
                    var winner_name = self.obj.res_player[1].val ();
                    var new_point = parseInt (self.obj.res_score[1].text ()) + 1;
      
                    self.obj.info.text ("And the winner is '" + winner_name + "'!");
                    self.obj.res_score[self.var.current].text (new_point);
      
                    self.restart_game ();
                    return;
               }
            
               if ( enemy_pos.indexOf (warning[j][0]) != -1 && enemy_pos.indexOf (warning[j][1]) != -1 )
                    threat.push (solution[j]);
          }
    }
    
    threat = threat.reduce (function (prev, curr) {
      for ( var j in prev ) {
            if ( prev[j][0] == curr ) {
                 prev[j][1]++;
                 return prev;
            }
      }
      prev.push ([ curr, 1 ]);
      
      return prev; 
    }, []).sort (function (a, b) { return a[1] - b[1]; });
    
    if ( threat.length > 0 ) {
         self.obj.cell[threat[0][0]].text (self.var.sign[1]);
         self.obj.cell[threat[0][0]].addClass ('game-cell-disable');
         
         self.var.disabled++;
         self.change_player ();
         return;
    }

    var random_move = Math.round (Math.random () * (free_pos.length - 1));

    self.obj.cell[free_pos[random_move]].text (self.var.sign[1]);
    self.obj.cell[free_pos[random_move]].addClass ('game-cell-disable');
    
    self.var.disabled++;
    self.change_player ();
  };
  
  this.restart_game = function () {
     self.obj.info.show ('fade', 400);
     setTimeout (function () {
        self.var.disabled = 0;
        self.obj.info.hide ('fade', 400);
           
        setTimeout (function () {
           for ( var j = 0; j < 9; j++ ) {
                 self.obj.cell[j].text ("");
                 self.obj.cell[j].removeClass ('game-cell-disable');
           }
          
           if ( self.var.current == 1 && self.var.cpu_ctrl )
                self.cpu_turn ();
          
        }, 500);
     }, 1000);  
  };
  
  this.change_player = function () {
    if ( self.var.disabled > 8 ) {
         if ( self.check_winner (0) ) {
              var winner_name = self.obj.res_player[0].val ();
              var new_point = parseInt (self.obj.res_score[0].text ()) + 1;
      
              self.obj.info.text ("And the winner is '" + winner_name + "'!");
              self.obj.res_score[0].text (new_point);

              self.restart_game ();
              return;
         }
      
         if ( self.check_winner (1) ) {
              var winner_name = self.obj.res_player[1].val ();
              var new_point = parseInt (self.obj.res_score[1].text ()) + 1;
      
              self.obj.info.text ("And the winner is '" + winner_name + "'!");
              self.obj.res_score[1].text (new_point);

              self.restart_game ();
              return;
         }
      
         self.obj.info.text ("It was a draw!");
         self.restart_game ();
         return;
    }
    
    self.obj.res_player[self.var.current].parent ().removeClass ('current-player');
    self.var.current = ( self.var.current == 0 ) ? 1 : 0;
    self.obj.res_player[self.var.current].parent ().addClass ('current-player');
  };
  
  this.check_winner = function (id) {
    var win_case = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], 
                     [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ];
    var id_pos = [];
    
    for ( var j = 0; j < 9; j++ ) 
          if ( self.obj.cell[j].text () == self.var.sign[id] ) 
               id_pos.push (j);
   
    for ( var k in win_case ) 
          if ( id_pos.indexOf (win_case[k][0]) != -1 
            && id_pos.indexOf (win_case[k][1]) != -1 
            && id_pos.indexOf (win_case[k][2]) != -1 )
               return true;
   
    return false;
  };
  
  this.cell_sign = function () {
    var curr_pos = parseInt ($(this).data ('n'));

    if ( $(this).text () != "" )
         return;
    
    $(this).text (self.var.sign[self.var.current]);
    $(this).addClass ('game-cell-disable');
    
    if ( self.check_winner (self.var.current) ) {
         var winner_name = self.obj.res_player[self.var.current].val ();
         var new_point = parseInt (self.obj.res_score[self.var.current].text ()) + 1;
      
         self.obj.info.text ("And the winner is '" + winner_name + "'!");
         self.obj.res_score[self.var.current].text (new_point);

         self.restart_game ();
         return;
    }
    
    self.var.disabled++;
    self.change_player ();
    
    if ( self.var.cpu_ctrl )
         self.cpu_turn ();
  };
  
  /* events */
  this.obj.game_mode[0].click (this.choose_type);
  this.obj.game_mode[1].click (this.choose_type);
  this.obj.sign[0].click (this.choose_sign);
  this.obj.sign[1].click (this.choose_sign);
  this.obj.reset_all.click (this.reset);
  
  for ( var j = 0; j < 9; j++ )
        this.obj.cell[j].click (this.cell_sign);
}

$(document).ready (function () {
  var NeckersTTT = new TicTacToe (".result", ".score-info", ".score-info input", 
                                  ".game-mode", ".choose", ".choose-sign", 
                                  ".game", ".game-cell", ".info");
})