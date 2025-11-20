import React, { useEffect, useState, useContext } from "react";
import axios from "../config/axios";
import { UserContext } from "../context/user.context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import FallingText from "../components/GSAPui/Falling";
import LightRays from "../components/GSAPui/Light";
import EditProfileModal from "../components/model/EditProfileModel";

const Profile = () => {
    const { user } = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [profession, setProfession] = useState("");
    const [skills, setSkills] = useState([]);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        const load = async () => {
            try {
                const res = await axios.get("/users/profile");
                setProfile(res.data.user);
                console.log(res.data.user);
            } catch (err) {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.get("/users/logout");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
            toast.success("Logged out successfully");
        } catch (err) {
            toast.error("Logout failed");
        }
    };

    const updateProfile = async (updatedData) => {
        try {
            const res = await axios.put("/users/me", updatedData);
            setProfile(res.data.user);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Profile update failed", error);
            toast.error("Profile update failed");
        }
    }

    if (loading || !profile) {
        return (
            <div className="min-h-screen flex justify-center items-center text-gray-300">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d1117] text-white relative overflow-hidden">

            {/* 🌟 LIGHT RAYS — Always Behind */}
            <div className="absolute inset-1 z-10 pointer-events-none">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#00ffff"
                    raysSpeed={1.1}
                    lightSpread={0.8}
                    rayLength={2.0}
                    followMouse={true}
                    mouseInfluence={0.5}
                    noiseAmount={0.1}
                    distortion={0.05}
                    className="w-full h-full"
                />
            </div>

            
            <header className="w-full fixed top-0 left-0 z-50 bg-[#161b22]/90 backdrop-blur-sm border-b border-gray-800 px-6 py-4 flex justify-between items-center">


                
                <span
                    onClick={() => navigate("/")}
                    className="text-2xl font-bold cursor-pointer text-transparent bg-clip-text  bg-gradient-to-r from-purple-400 to-indigo-400"
                >
                    CodeFusion
                </span>

                
                <div className="flex items-center gap-6">

                    
                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => navigate("/dashboard")}
                    >
                        <span className="text-gray-300 font-semibold text-md group-hover:text-white transition">
                            Dashboard
                        </span>
                    </div>

                   
                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => setShowDialog(true)}
                    >
                        <span className="text-gray-300 font-semibold text-md group-hover:text-red-400 transition">
                            Logout
                        </span>

                        <img
                            src={profile.profilePicture}
                            className="w-8 h-8 rounded-full border border-gray-700 group-hover:border-red-400 transition"
                            alt="avatar"
                        />
                    </div>

                </div>

            </header>

           
            <div className="relative z-10 px-6 py-12 flex justify-center pt-28">

                <div className="w-full max-w-5xl">

                   
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">

                        <img
                            src={profile.profilePicture}
                            alt="avatar"
                            className="w-32 h-32 rounded-full border border-gray-600 shadow-lg"
                        />

                        <div>
                            <h1 className="text-3xl font-bold">{profile.username}</h1>
                            <p className="text-gray-400 text-lg mt-1">{profile.profession}</p>
                            <p className="text-gray-400 text-sm mt-2">{profile.email}</p>

                            <Button onClick={() => setOpenEditModal(true)} className="mt-4 bg-gray-800 hover:bg-gray-700 border border-gray-600">
                                Edit Profile
                            </Button>
                        </div>

                    </div>

                    <div className="border-b border-gray-800 my-8"></div>

                    
                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-gray-200 mb-3">Bio</h2>
                        <p className="text-gray-300">{profile.bio || "No bio added yet."}</p>
                    </section>

                    <div className="border-b border-gray-800 my-8"></div>

                    

                   
                    <section className="my-12">
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">Skills</h2>

                        {profile.skills?.length > 0 ? (
                            <div className="relative w-full h-[150px] md:h-[180px] overflow-hidden rounded-lg border border-gray-800 bg-[#0d1117]/50 backdrop-blur-sm flex items-center justify-center">

                                <FallingText
                                    text={profile.skills.join("   ")}
                                    highlightWords={profile.skills}
                                    highlightClass="highlighted"
                                    trigger="hover"
                                    backgroundColor="transparent"
                                    wireframes={false}
                                    gravity={0.4}
                                    fontSize="1.6rem"
                                    mouseConstraintStiffness={0.8}
                                />

                            </div>
                        ) : (
                            <p className="text-gray-400">No skills added yet.</p>
                        )}
                    </section>



                </div>
            </div>
            <EditProfileModal
                isOpen={openEditModal}
                onClose={() => setOpenEditModal(false)}
                username={username}
                bio={bio}
                profession={profession}
                skills={skills}
                setUsername={setUsername}
                setBio={setBio}
                setProfession={setProfession}
                setSkills={setSkills}
                onSave={updateProfile}
            />

            
            {showDialog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-2xl w-96 animate-fadeIn">
                        <h3 className="text-xl font-bold mb-4 text-white">
                            Confirm Logout
                        </h3>
                        <p className="text-gray-300">
                            Are you sure you want to logout?
                        </p>
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setShowDialog(false  
)}                                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>                        
                             <button
                                onClick={handleLogout}  
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition"      
                            >
                                Logout
                            </button>       
                        </div>
                    </div>
                </div>  
                                )}


        </div>

    );
};

export default Profile;
