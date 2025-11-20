import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";

const EditProfileModal = ({
    isOpen,
    onClose,
    username,
    setUsername,
    bio,
    setBio,
    profession,
    setProfession,
    skills,
    setSkills,
    onSave
}) => {
    const [skillsInput, setSkillsInput] = React.useState("");

    const addSkill = () => {
        if (skillsInput.trim() && !skills.includes(skillsInput.trim())) {
            setSkills([...skills, skillsInput.trim()]);
            setSkillsInput("");
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter((skill) => skill !== skillToRemove));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#161b22] text-white border-gray-700 p-6 max-w-lg">

                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>


                <div className="space-y-4">

                    <div>
                        <label className="text-gray-300">Username</label>
                        <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-gray-900 border-gray-700 text-white mt-1"
                        />
                    </div>

                    <div>
                        <label className="text-gray-300">Bio</label>
                        <Input
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="bg-gray-900 border-gray-700 text-white mt-1"
                        />
                    </div>

                    <div>
                        <label className="text-gray-300">Profession</label>
                        <Input
                            value={profession}
                            onChange={(e) => setProfession(e.target.value)}
                            className="bg-gray-900 border-gray-700 text-white mt-1"
                        />
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="text-gray-300 mb-1 block">Skills</label>

                        <div className="flex gap-2">
                            <Input
                                value={skillsInput}
                                onChange={(e) => setSkillsInput(e.target.value)}
                                placeholder="Add a skill"
                                className="bg-gray-900 border-gray-700 text-white"
                            />
                            <Button onClick={addSkill} className="bg-indigo-600 hover:bg-indigo-700">
                                Add
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full flex items-center gap-2"
                                >
                                    {skill}
                                    <button onClick={() => removeSkill(skill)} className="text-red-400 hover:text-red-600">
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <Button
                        onClick={onClose}
                        className="bg-gray-700 hover:bg-gray-600"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={() =>
                            onSave({
                                username,
                                bio,
                                profession,
                                skills
                            })
                        }
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        Save Changes
                    </Button>

                </div>

            </DialogContent>
        </Dialog>
    )
}

export default EditProfileModal;