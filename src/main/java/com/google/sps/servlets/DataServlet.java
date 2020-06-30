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
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.gson.Gson;
import com.google.sps.data.Comment;
import java.io.IOException;
import java.lang.Integer;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  private static final SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
  
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    Query query = new Query(Comment.MESSAGE_KEY).addSort(Comment.TIMESTAMP_KEY, SortDirection.DESCENDING);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    ArrayList<Comment> comments = new ArrayList<Comment>(); 

    // limit 10 comments
    for(Entity entity : results.asIterable(FetchOptions.Builder.withLimit(10))) {
      String name = (String) entity.getProperty(Comment.NAME_KEY);
      String message = (String) entity.getProperty(Comment.MESSAGE_KEY);
      long timestamp = (long) entity.getProperty(Comment.TIMESTAMP_KEY);
      String time = (String) entity.getProperty(Comment.TIME_KEY);

      Comment comment = new Comment(name, message, timestamp, time);
      comments.add(comment); 
    }

    final Gson gson = new Gson();
    String jsonComments = gson.toJson(comments);
    response.setContentType("text/html;");
    response.getWriter().println(jsonComments);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String name = getParameter(request, "name-input", "");
    String message = getParameter(request, "text-input", "");
    long timestamp = System.currentTimeMillis();

    Date date = new Date(timestamp);
    String time = dateFormat.format(date);

    Entity commentEntity = new Entity(Comment.MESSAGE_KEY);
    commentEntity.setProperty(Comment.NAME_KEY, name);
    commentEntity.setProperty(Comment.MESSAGE_KEY, message);
    commentEntity.setProperty(Comment.TIMESTAMP_KEY, timestamp);
    commentEntity.setProperty(Comment.TIME_KEY, time);
    
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);

    response.sendRedirect("/comments.html");
  }

  private String getParameter(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    return value == null ? defaultValue : value;
  }
}