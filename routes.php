<?php

/*
  |--------------------------------------------------------------------------
  | Application Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register all of the routes for an application.
  | It's a breeze. Simply tell Laravel the URIs it should respond to
  | and give it the Closure to execute when that URI is requested.
  |
 */

Route::get('/', function() {
    return View::make('hello');
});

Route::group(array('prefix' => 'payment'), function() {
    Route::get('/orderCheck', 'PaymentController@showError');
    Route::get('/paymentAviso', 'PaymentController@showError');
    Route::post('/orderCheck', 'PaymentController@orderCheck');
    Route::post('/paymentAviso', 'PaymentController@paymentAviso'); //result url
    Route::post('/cancelOrder', 'PaymentController@cancelOrder');
    Route::get('/', 'PaymentController@showForm');
    Route::get('/success', 'PaymentController@successUrl');
    Route::get('/fail', 'PaymentController@failUrl');

});


Route::get('/oauth/authorize', array('before' => 'check-authorization-params|auth', function() {
        // get the data from the check-authorization-params filter
        $params = Session::get('authorize-params');

        // get the user id
        $params['user_id'] = Auth::user()->id;

        // display the authorization form
        return View::make('authorization-form', array('params' => $params));
    }));


        Route::post('/oauth/authorize', array('before' => 'check-authorization-params|auth|csrf', function() {
                // get the data from the check-authorization-params filter
                $params = Session::get('authorize-params');

                // get the user id
                $params['user_id'] = Auth::user()->id;

                // check if the user approved or denied the authorization request
                if (Input::get('approve') !== null) {

                    $code = AuthorizationServer::newAuthorizeRequest('user', $params['user_id'], $params);

                    Session::forget('authorize-params');

                    return Redirect::to(AuthorizationServer::makeRedirectWithCode($code, $params));
                }

                if (Input::get('deny') !== null) {

                    Session::forget('authorize-params');

                    return Redirect::to(AuthorizationServer::makeRedirectWithError($params));
                }
            }));

        Route::post('/auth','AuthController@index');
            
        Route::group(array('prefix' => 'api', 'before' => 'auth-hash'), function() {
            Route::get('achievements/{achievement_id}/comments', 'AchievementController@getComments');
            Route::get('achievements/{achievement_id}/nodes', 'AchievementController@getNodes');
            Route::get('achievements/{achievement_id}/parent', 'AchievementController@getParent');
            Route::get('achievements/{achievement_id}/restore', 'AchievementController@restore');
            Route::get('achievements/search/{value}', 'AchievementController@search');
            //Route::get('achievements/create/{hash}', 'AchievementController@create');
            //Route::post('achievements/store/{hash}', 'AchievementController@store');
            //Route::get('achievements/{achievement_id}/edit/{hash}', 'AchievementController@edit');
            //Route::post('achievements/{achievement_id}/update/{hash}', 'AchievementController@update');
            Route::post('achievements/{achievement_id}', 'AchievementController@update');
            //Route::delete('achievements/{achievement_id}/delete/{hash}', 'AchievementController@delete');ив
            //список голосов для ачивки CHECKED
            Route::get('/achievements/{achievement_id}/voices', 'AchievementController@getVoices');
            Route::resource('achievements', 'AchievementController');

            Route::get('achievement-types/{id}/restore', 'AchievementTypeController@restore');
            Route::resource('achievement-types', 'AchievementTypeController');

            Route::get('types/{id}/restore', 'TypeController@restore');
            Route::get('types/{id}/achievements', 'TypeController@getAchievements');
            Route::post('types/{id}', 'TypeController@update');
            Route::resource('types', 'TypeController');

            Route::get('comments/{comment_id)/restore', 'CommentController@restore');
            Route::post('comments/{comment_id}', 'CommentController@update');
            Route::resource('comments', 'CommentController');


            Route::get('/users', 'UserController@all');
            Route::get('/user-search/{string}', 'UserController@search');
            Route::get('/users/subs/achievements/{user_id}', 'UserAchievementsController@subs_achieve');
            Route::resource('user', 'UserController');
            Route::resource('user-subs', 'UserSubsController');

            Route::get('/user-achievements-count/', 'UserAchievementsController@count');
            Route::get('/user-achievements/{achievement_id}/restore', 'UserAchievementsController@restore');
            Route::get('/user-achievements/create/{achievement_id}/{hash}', 'UserAchievementsController@create');
            Route::resource('user-achievements', 'UserAchievementsController');

            Route::post('/user-settings/update', 'UserSettingsController@update');
            Route::resource('user-settings', 'UserSettingsController');

            // Получить голос пользователя для конкретной ачивки
            // /achievement-voices/voices?user=%user id%&achievement=%achievement_id%&hash=%user_hash%
            Route::get('/achievement-voices/voices', 'AchievementVoiceController@getVoice');
            Route::get('/achievement-voices/{id}/restore', 'AchievementVoiceController@restore');
            /* RESTFull routes
             * TESTED:
             * GET /achievement-voices?achievement=%achievement_id%&hash=hash AchievementVoiceController@index
             * GET /achievement-voices/{id} AchievementVoiceController@show
             * NOT TESTED
             * GET /achievement-voices/{id}/edit AchievementVoiceController@edit
             * GET /achievement-voices/create AchievementVoiceController@create
             * POST /achievement-voices AchievementVoiceController@store
             * PUT/PATCH /achievement-voices/{id} AchievementVoiceController@update
             * DELETE /achievement-voices/{id} AchievementVoiceController@destroy
            */
            Route::resource('achievement-voices','AchievementVoiceController' );

            //Доказательства ачивок
            Route::get('/achievement-proofs/{id}/restore', 'AchievementProofController@restore');
            /* RESTFull routes
             * GET /achievement-proofs?achievement=%achievement_id%&hash=hash AchievementProofController@index
             * GET /achievement-proofs/{id} AchievementProofController@show
             *  POST /achievement-proofs AchievementProofController@store
             * PUT/PATCH /achievement-proofs/{id} AchievementProofController@update
             * DELETE /achievement-proofs/{id} AchievementProofController@destroy
             * Не написаны:
             * GET /achievement-proofs/{id}/edit AchievementProofController@edit
             * GET /achievement-proofs/create AchievementProofController@create
             *
            */
            Route::resource('achievement-proofs','AchievementProofController' );

        });