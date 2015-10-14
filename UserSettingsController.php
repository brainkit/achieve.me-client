<?php

class UserSettingsController extends \BaseController {

    /**
     * Display a listing of the resource.
     * GET /user-settings
     *
     * @return Response
     */
    public function index() {
        $user = User::find(Session::get('user_id'));
        $userSettings = UserSettings::where('user_id', '=', $user->id)->first();
        //TODO check for null
        if ($userSettings != null) {
            return $userSettings->toJson();
        }
           }


    /**
     * Show the form for creating a new resource.
     * GET /user-settings/create
     *
     * @return Response
     */
    public function create() {
        //
    }

    /**
     * Store a newly created resource in storage.
     * POST /user-settings
     *
     * @return Response
     */
    public function store() {
        //
    }

    /**
     * Display the specified resource.
     * GET /user-settings/{hash}
     *
     * @param  stiring  $hash
     * @return Response
     */
    public function show($hash) {
        $user = User::where('hash', '=', $hash)->first();
        $userSettings = UserSettings::where('user_id', '=', $user->id)->first();
        if ($userSettings != null) {
            return $userSettings->toJson();
        }
    }

    /**
     * Нужно тестить, не работает редактирование
     * Show the form for editing the specified resource.
     * GET /user-settings/{hash}/edit
     *
     * @return Response
     */
    public function edit($hash) {
        return View::make('user_settings_edit', array('hash' => $hash));
    }

    /**
     * Update the specified resource in storage.
     * POST /user-settings/update
     * @param  string  $hash
     * @return Response
     */
    public function update() {
        $user = User::find(Session::get('user_id'));
        $userSettings = UserSettings::where('user_id', '=', $user->id)->first();
		$response = Array();
        if (Request::get('social_integration')) {
            $userSettings->social_integration = Request::get('social_integration');
			$response['social_integration'] = $userSettings->social_integration;
        }
        if (Request::get('name')) {
            $userSettings->name = Request::get('name');
			$response['name'] = $userSettings->name;
        }
        if (Input::file('photo')) {
            $userSettings->photo = $this->upload_photo($user->id);
			$response['photo'] = $userSettings->photo;
        }
        if (Request::get('rating')) {
            $userSettings->rating = Request::get('rating');
			$response['rating'] = $userSettings->rating;
        }
        if (Request::get('interests')) {
            $userSettings->interests = Request::get('interests');
			$response['interests'] = $userSettings->interests;
        }
        $userSettings->save(); /**/
		if(count($response)){
			return Response::json($response, 200);
		}else{
			return Response::json('error', 400);
		}
    }

    private function upload_photo($id) {
        $file = Input::file('photo'); // your file upload input field in the form should be named 'file'
        $destinationPath = 'uploads/avatar/';
        $filename = $id . ".jpg";
        $uploadSuccess = Input::file('photo')->move($destinationPath, $filename);
        //print_r($uploadSuccess);
        if ($uploadSuccess) {
            return "/" . $destinationPath . $filename; // or do a redirect with some message that file was uploaded
        } else {
            return Response::json('error', 400);
        } /* */
    }

    /**
     * Remove the specified resource from storage.
     * DELETE /user-settings/{id}
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id) {
        //
    }

}
