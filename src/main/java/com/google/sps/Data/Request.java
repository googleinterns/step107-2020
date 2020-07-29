package com.google.sps.data;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;

public final class Request {

  /** Returns the ID of the current school as an integer. */
  // TODO:  Add throw exception and display an error message to the end users.
  static public int getId(HttpServletRequest request) {
    int fail = -1;
    try {
      return Integer.parseInt(request.getParameter("id"));
    } catch (NumberFormatException exception) {
      System.out.println("getID Invalid parametr: ID request is not a valid number.");
    }
    return fail;
  }
}
