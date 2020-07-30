// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.oauth.OAuthService;
import com.google.appengine.api.oauth.OAuthServiceFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.api.oauth.OAuthServiceFailureException;
import com.google.gson.Gson;
import com.google.sps.data.Request;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;
import java.util.HashMap;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/user")
public class LoginServlet extends HttpServlet {
  
  @Override 
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    UserService userService = UserServiceFactory.getUserService();
    Map loginStatusInfoMap = new HashMap();
    int id = Request.getId(request);
    String reviewsPageLink = String.format("/college-info.html?id=%d#reviews", id);
    String nicknameLink = String.format("/nickname.html?id=%d", id);

    if (userService.isUserLoggedIn()) {
      // Get user credentials.
      User user = userService.getCurrentUser();
      String userEmail = user.getEmail();
      String logoutURL = userService.createLogoutURL(reviewsPageLink);

      // Load credentials into JSON object.
      loginStatusInfoMap.put("email", userEmail);
      loginStatusInfoMap.put("logoutURL", logoutURL);
      loginStatusInfoMap.put("isLoggedIn", new Boolean(true));

    } else {
      String loginURL = userService.createLoginURL("/nickname.html");

      // Load credentials into JSON object.
      loginStatusInfoMap.put("loginURL", loginURL);
      loginStatusInfoMap.put("isLoggedIn", new Boolean(false));
    }

    // Convert to JSON and send as response.
    Gson gson = new Gson();
    response.setContentType("application/json");
    response.getWriter().println(gson.toJson(loginStatusInfoMap));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    UserService userService = UserServiceFactory.getUserService();
    if (!userService.isUserLoggedIn()) {
      response.sendRedirect("/user");
      return;
    }

    String nickname = request.getParameter("nickname");
    String userId = userService.getCurrentUser().getUserId();

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Entity entity = new Entity("UserInfo", userId);
    entity.setProperty("userId", userId);
    entity.setProperty("nickname", nickname);
    // The put() function automatically inserts new data or updates existing data based on ID.
    datastore.put(entity);

    int id = Request.getId(request);
    String reviewsPageLink = String.format("/college-info.html?id=%d#reviews", id);

    response.sendRedirect(reviewsPageLink);
  }

  private String getParameter(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    return value == null ? defaultValue : value;
  }
}
