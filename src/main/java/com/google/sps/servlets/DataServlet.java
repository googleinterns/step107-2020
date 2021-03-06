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
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import com.google.sps.data.Comment;
import com.google.sps.data.RequestUtil;
import java.io.*;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns comments. */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  private static final SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    int id = RequestUtil.getId(request);

    // Filter query based on current ID of school.
    Filter idFilter = new FilterPredicate(Comment.SCHOOL_ID_KEY, FilterOperator.EQUAL, id);

    Query query =
        new Query(Comment.COMMENT_ENTITY)
            .addSort(Comment.TIMESTAMP_KEY, SortDirection.DESCENDING)
            .setFilter(idFilter);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    ArrayList<Comment> comments = new ArrayList<Comment>();

    // For MVP, only fetch the first 10 comments.
    Iterable<Entity> entities = results.asIterable(FetchOptions.Builder.withLimit(10));
    for (Entity entity : entities) {
      String name = (String) entity.getProperty(Comment.NAME_KEY);
      String message = (String) entity.getProperty(Comment.MESSAGE_KEY);
      long timestamp = (long) entity.getProperty(Comment.TIMESTAMP_KEY);
      String time = (String) entity.getProperty(Comment.TIME_KEY);

      Comment comment = new Comment(name, message, timestamp, time, id);
      comments.add(comment);
    }

    final Gson gson = new Gson();
    String jsonComments = gson.toJson(comments);
    response.setContentType("application/json");
    response.getWriter().println(jsonComments);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String name = getParameter(request, "name-input", "");
    String message = getParameter(request, "text-input", "");
    long timestamp = System.currentTimeMillis();
    int id = RequestUtil.getId(request);
    Date date = new Date();
    String time = dateFormat.format(date);

    // Gets current user nickname from logged in user.
    UserService userService = UserServiceFactory.getUserService();
    String userId = userService.getCurrentUser().getUserId();
    String nickname = getUserNickname(userId);

    // Creates comment entity.
    Entity commentEntity = new Entity(Comment.COMMENT_ENTITY);
    commentEntity.setProperty(Comment.NAME_KEY, nickname);
    commentEntity.setProperty(Comment.MESSAGE_KEY, message);
    commentEntity.setProperty(Comment.TIMESTAMP_KEY, timestamp);
    commentEntity.setProperty(Comment.TIME_KEY, time);
    commentEntity.setProperty(Comment.SCHOOL_ID_KEY, id);

    // Stores comment entity,
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);

    // Redirects to stay on the reviews page.
    String responseLink = String.format("/college-info.html?id=%d#reviews", id);
    response.sendRedirect(responseLink);
  }

  private String getParameter(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    return value == null ? defaultValue : value;
  }

  /** Returns the nickname of the user with id, or null if the user has not set a nickname. */
  private String getUserNickname(String userId) {
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Query query =
        new Query("UserInfo")
            .setFilter(new Query.FilterPredicate("userId", Query.FilterOperator.EQUAL, userId));
    PreparedQuery results = datastore.prepare(query);
    Entity entity = results.asSingleEntity();
    if (entity == null) {
      return "Anonymous";
    }
    String nickname = (String) entity.getProperty("nickname");
    return nickname;
  }
}
