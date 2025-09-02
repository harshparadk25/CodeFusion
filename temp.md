<main className="h-screen w-screen flex overflow-hidden">
      <section className="left relative flex flex-col h-screen min-w-85 bg-slate-300">
        {/* Header */}
        <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute z-10 top-0">
          <button className="flex gap-2" onClick={() => setIsModalOpen(true)}>
            <i className="ri-add-fill mr-1"></i>
            <p>Add collaborator</p>
          </button>

          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="p-2"
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>


        <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
          <div ref={messageBox} className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-hide">
                      {messages.map((msg, index) => (
                        <div key={index} className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} ${msg.sender._id == user._id.toString() && 'ml-auto'}  message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}>
                            <small className="opacity-65 text-sm">{msg.sender.email}</small>
                            <p className="text-sm">
                              {
                                msg.sender._id === 'ai' ? <div>
                                  <Markdown 
                                  children={msg.content}
                                  options={{
                                    overrides: {
                                      code: SyntaxHighlightedCode,
                                    },
                                  }}
                                  />
                                </div> : msg.message
                              }
                            </p>
                        </div>
                      ))}

                      
          </div>

          <div className="inputField w-full flex absolute bottom-0">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-2 px-4 border-none outline-none flex-grow"
              type="text"
              placeholder="Enter message"
            />
            <button onClick={send} className="px-5 bg-slate-950 text-white">
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>


        <div
          className={`side-panel w-full h-full bg-red-500 absolute right-86 top-20 transition-all ${isSidePanelOpen ? "translate-x-full" : ""
            }`}
        >
          <header className="flex justify-between items-center px-4 p-2 bg-slate-200">
            <h1 className="font-semibold text-lg ml-3">Collaborators</h1>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-2"
            >
              <i className="ri-close-fill"></i>
            </button>
          </header>

          <div className="user flex flex-col gap-2 mt-2">
            {project?.users?.map((collaborator) => (
              <div
                key={collaborator._id}
                className="user flex items-center gap-4 p-2 cursor-pointer hover:bg-slate-500"
              >
                <div className="aspect-square w-10 h-10 bg-slate-600 text-white rounded-full flex items-center justify-center">
                  <i className="ri-user-fill"></i>
                </div>
                <h1 className="font-semibold text-lg">
                  {collaborator.email}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </section>

      <h1 className="absolute left-1/2 transform -translate-x-1/2 font-semibold text-lg">
        {project?.name || "Project"}
      </h1>


      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select User</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2">
                <i className="ri-close-fill"></i>
              </button>
            </header>
            <div className="users-list flex flex-col gap-2 mb-16 max-h-80 overflow-auto">
              {users.map((user) => (
                <div
                  key={user._id}
                  className={`user cursor-pointer hover:bg-slate-200 ${selectedUserId.has(user._id) ? "bg-slate-200" : ""
                    } p-2 flex gap-2 items-center`}
                  onClick={() => handleUserClick(user._id)}
                >
                  <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                    <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className="font-semibold text-lg">{user.email}</h1>
                </div>
              ))}
            </div>

            <Button
              onClick={addCollaborator}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Add Collaborators
            </Button>
          </div>
        </div>
      )}
    </main>