import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SharedBuild {
    id: string;
    title: string;
    likeCount: bigint;
    description: string;
    author: Principal;
    timestamp: Time;
    previewData: string;
    comments: Array<Comment>;
}
export interface Build {
    id: string;
    partsJson: string;
    name: string;
    description: string;
    timestamp: Time;
}
export type Time = bigint;
export interface Comment {
    content: string;
    user: Principal;
    timestamp: Time;
}
export interface GuideProgress {
    guideId: string;
    user: Principal;
    completed: boolean;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(buildId: string, content: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeGuide(guideId: string): Promise<void>;
    deleteBuild(buildId: string): Promise<void>;
    getAllSharedBuilds(): Promise<Array<SharedBuild>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserBuilds(): Promise<Array<Build>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProgress(): Promise<Array<GuideProgress>>;
    isCallerAdmin(): Promise<boolean>;
    likeBuild(buildId: string): Promise<void>;
    saveBuild(build: Build): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    shareBuild(build: SharedBuild): Promise<void>;
}
