import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import {
  User,
  Settings,
  LogOut,
  Monitor,
  Smartphone,
  UserCog,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import { Skeleton } from "../../../components/ui/skeleton";
import { useEffect, useState } from "react";
import {
  fetchUserSessions,
  logout,
  logoutAllSessions,
  logoutSpecificSession,
} from "../../../services/authService";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import type { AxiosErrorResponse, Session } from "../../../types/index";

const Dashboard = () => {
  const userProfile = useAuthStore((s) => s.user);
  const logoutUser = useAuthStore((s) => s.logout);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<Session[] | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutAllLoading, setLogoutAllLoading] = useState(false);

  const loadSessions = async () => {
    try {
      const res = await fetchUserSessions();
      setSessionData(res.data);
    } catch (error: unknown) {
      const err = error as AxiosErrorResponse;
      toast.error(err?.response?.data?.message || "Failed to fetch sessions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const logoutHandler = async () => {
    try {
      setLogoutLoading(true);
      const res = await logout();
      toast.success(res.message || "Logged out");
      logoutUser();
      navigate({ to: "/login" });
    } catch (error: unknown) {
      const err = error as AxiosErrorResponse;
      toast.error(err?.response?.data?.message || "Logout failed");
    } finally {
      setLogoutLoading(false);
    }
  };

  const logoutAllHandler = async () => {
    try {
      setLogoutAllLoading(true);
      const res = await logoutAllSessions();
      toast.success(res.message || "Logged out from all other sessions");
      loadSessions();
    } catch (error: unknown) {
      const err = error as AxiosErrorResponse;
      toast.error(err?.response?.data?.message || "Logout failed");
    } finally {
      setLogoutAllLoading(false);
    }
  };

  const logoutSpecificSessionHandler = async (id: string) => {
    try {
      const res = await logoutSpecificSession(id);
      toast.success(res.message || "Session logged out");
      loadSessions();
    } catch (error: unknown) {
      const err = error as AxiosErrorResponse;
      toast.error(err?.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Dashboard</h1>
            <p className="text-zinc-400">Manage your account and sessions</p>
          </div>
          <div className="flex gap-6 text-zinc-900">
            {userProfile?.role === "admin" && (
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/admin" })}
              >
                <UserCog className="h-4 w-4 mr-2" />
                Admin Dashboard
              </Button>
            )}
            <Button
              variant="outline"
              disabled={logoutLoading}
              onClick={logoutHandler}
            >
              {logoutLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Logout...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              )}
            </Button>
            <Button
              variant="outline"
              disabled={logoutAllLoading}
              onClick={logoutAllHandler}
            >
              {logoutAllLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Logout...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout All Other Sessions
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-500">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <Settings className="h-4 w-4 mr-2" />
              Sessions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-zinc-900 border-white/10 text-zinc-50">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={userProfile?.avatar ?? undefined}
                      alt={userProfile?.fullname ?? "User Avatar"}
                    />
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Full Name
                        </p>
                        <p className="text-lg">{userProfile?.fullname}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <Badge>{userProfile?.role}</Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{userProfile?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Account ID
                      </p>
                      <p className="font-mono">{userProfile?._id}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <Card className="bg-zinc-900 border-white/10 text-zinc-50">
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-8 w-[80px]" />
                      </div>
                    ))}
                  </div>
                ) : sessionData ? (
                  <Table className="text-zinc-50">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-zinc-50 font-bold">
                          Device
                        </TableHead>
                        <TableHead className="text-zinc-50 font-bold">
                          Location
                        </TableHead>
                        <TableHead className="text-zinc-50 font-bold">
                          IP Address
                        </TableHead>
                        <TableHead className="text-zinc-50 font-bold">
                          Last Active
                        </TableHead>
                        <TableHead className="text-zinc-50 font-bold">
                          Status
                        </TableHead>
                        <TableHead className="text-zinc-50 font-bold">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessionData.map((s) => {
                        const Icon = s.device.includes("Mobile")
                          ? Smartphone
                          : Monitor;
                        return (
                          <TableRow
                            key={s._id}
                            className="hover:bg-zinc-800 cursor-pointer"
                          >
                            <TableCell className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {s.device}
                            </TableCell>
                            <TableCell>{s.location}</TableCell>
                            <TableCell>{s.ip}</TableCell>
                            <TableCell>{s.lastActivity}</TableCell>
                            <TableCell>
                              <Badge
                                variant="default"
                                className={
                                  s.current
                                    ? "bg-zinc-50 text-zinc-900"
                                    : s.status === "active"
                                      ? "bg-green-300 text-zinc-800"
                                      : "bg-red-400 text-white"
                                }
                              >
                                {s.current ? "current" : s.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {!s.current && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="h-7 cursor-pointer"
                                  onClick={() =>
                                    logoutSpecificSessionHandler(s._id)
                                  }
                                >
                                  <LogOut className="h-4 w-4 mr-1" />
                                  Logout
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm">No active sessions.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
