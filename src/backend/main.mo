import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Types
  public type UserProfile = {
    name : Text;
  };

  type Build = {
    id : Text;
    name : Text;
    description : Text;
    partsJson : Text;
    timestamp : Time.Time;
  };

  type SharedBuild = {
    id : Text;
    title : Text;
    description : Text;
    previewData : Text;
    author : Principal;
    timestamp : Time.Time;
    likeCount : Nat;
    comments : [Comment];
  };

  type Comment = {
    user : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  type GuideProgress = {
    guideId : Text;
    user : Principal;
    completed : Bool;
    timestamp : Time.Time;
  };

  // Persistent Storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userBuilds = Map.empty<Principal, List.List<Build>>();
  let sharedBuilds = Map.empty<Text, SharedBuild>();
  let userProgress = Map.empty<Principal, List.List<GuideProgress>>();

  // User Profile Management

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Project Management

  // Save a user build
  public shared ({ caller }) func saveBuild(build : Build) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save builds");
    };
    let userBuildList = switch (userBuilds.get(caller)) {
      case (null) { List.empty<Build>() };
      case (?buildList) { buildList };
    };
    userBuildList.add(build);
    userBuilds.add(caller, userBuildList);
  };

  // Get all builds for a user
  public query ({ caller }) func getUserBuilds() : async [Build] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access builds");
    };
    switch (userBuilds.get(caller)) {
      case (null) { [] };
      case (?buildList) { buildList.toArray() };
    };
  };

  // Delete a user build
  public shared ({ caller }) func deleteBuild(buildId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete builds");
    };
    switch (userBuilds.get(caller)) {
      case (null) { Runtime.trap("Build not found") };
      case (?buildList) {
        let filteredList = buildList.filter(
          func(b : Build) : Bool { b.id != buildId }
        );
        if (filteredList.size() == buildList.size()) {
          Runtime.trap("Build not found");
        };
        userBuilds.add(caller, filteredList);
      };
    };
  };

  // Community Features

  // Share a build
  public shared ({ caller }) func shareBuild(build : SharedBuild) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can share builds");
    };
    // Enforce that the caller is the author
    if (build.author != caller) {
      Runtime.trap("Unauthorized: Cannot share build as another user");
    };
    sharedBuilds.add(build.id, build);
  };

  // Get all shared builds (accessible to everyone including guests)
  public query ({ caller }) func getAllSharedBuilds() : async [SharedBuild] {
    sharedBuilds.values().toArray();
  };

  // Like a shared build
  public shared ({ caller }) func likeBuild(buildId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like builds");
    };
    switch (sharedBuilds.get(buildId)) {
      case (null) { Runtime.trap("Build not found") };
      case (?build) {
        let updatedBuild = {
          build with
          likeCount = build.likeCount + 1;
        };
        sharedBuilds.add(buildId, updatedBuild);
      };
    };
  };

  // Add a comment to a shared build
  public shared ({ caller }) func addComment(buildId : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add comments");
    };
    switch (sharedBuilds.get(buildId)) {
      case (null) { Runtime.trap("Build not found") };
      case (?build) {
        let comment : Comment = {
          user = caller;
          content;
          timestamp = Time.now();
        };
        let commentsList = List.fromArray<Comment>(build.comments);
        commentsList.add(comment);
        let updatedComments = commentsList.toArray();
        let updatedBuild = {
          build with
          comments = updatedComments;
        };
        sharedBuilds.add(buildId, updatedBuild);
      };
    };
  };

  // Learning Progress

  // Mark guide as completed
  public shared ({ caller }) func completeGuide(guideId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete guides");
    };
    let progress : GuideProgress = {
      guideId;
      user = caller;
      completed = true;
      timestamp = Time.now();
    };
    let userProgressList = switch (userProgress.get(caller)) {
      case (null) { List.empty<GuideProgress>() };
      case (?progressList) { progressList };
    };
    userProgressList.add(progress);
    userProgress.add(caller, userProgressList);
  };

  // Get all completed guides for user
  public query ({ caller }) func getUserProgress() : async [GuideProgress] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access progress");
    };
    switch (userProgress.get(caller)) {
      case (null) { [] };
      case (?progressList) { progressList.toArray() };
    };
  };
};
