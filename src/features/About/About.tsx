import React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import Contents from './Contents'

import './About.less';
import ants from './john-lozano-ants.jpeg';
import blockly from './blockly.png'



export default function About() {
  return (
    <div className="about-page">
      <Grid container spacing={2}>
        <Grid item xs={12} lg={9}>
          <Container maxWidth="md">
            <h1>About Waggle</h1>
            <section id="about-waggle">
              <p>
                The Waggle web application allows users to visually program and run a simulated
                swarm robotics environment. Its primary purpose is to allow users to gain an
                understanding of swarm robotics and to allow instructors to educate and test
                students with the various simulation challenges available, or customizing their own.
              </p>
              <p>
                If you’d like to try using Waggle, the <Link to="/tutorial">Tutorial Simulation</Link> is a great place to start.
                Otherwise, the rest of this page will provide further information on the
                field of swarm robotics and the Waggle application itself.
              </p>
            </section>
            <section id="what-is-swarm-robotics">
              <h2>What is Swarm Robotics</h2>
              <blockquote>
                <p>
                  “Swarm robotics is the study of how a large number of relatively simple physically
                  embodied agents can be designed such that a desired collective behavior emerges
                  from the local interactions among the agents and between the agents and the
                  environment.”
                  <a href="https://link.springer.com/chapter/10.1007/978-3-540-30552-1_2"> [1]</a>
                </p>
              </blockquote>
              <p>
                For our purposes, we will be focusing on the idea of robots instead of
                physically embodied agents. So, swarm robotics involves multiple
                relatively simple robots that can range somewhat in number and in complexity. It’s
                important that the way they are constructed and programmed can allow them to follow
                a desired collective behaviour where the group of robots behave similarly to work
                together to achieve their desired goal. This will mostly take place by the robots
                interacting with each other and the environment they are located in to act
                accordingly or adjust their behaviour.
              </p>
            </section>
            <section id="characteristics-of-swarm-robotics">
              <h3>Characteristics of Swarm Robotics</h3>
              <p>
                To further differentiate swarm robotics from other types of robots,
                some characteristics can be defined.
              </p>
              <p>
                Swarm robotics is a multi-robot system with the following characteristics <a href="https://link.springer.com/article/10.1007/s11721-012-0075-2">[2]</a>:
              </p>
              <ul>
                <li>Robots are autonomous</li>
                <li>Robots are situated in the environment and can act to modify it</li>
                <li>Robots’ sensing and communication capabilities are local</li>
                <li>Robots do not have access to centralized control and/or to global knowledge</li>
                <li>Robots cooperate to tackle a given task</li>
              </ul>
              <p>
                This essentially means that for it to be swarm robotics, the robots
                are controlled by themselves, they are placed in an environment which
                they could modify, they can only locally sense and communicate, they
                don’t have global or centralized knowledge, and there are multiple
                robots that work together.
              </p>
              <p>
                This criteria narrows down the potential robots and systems that can count as
                within the swarm robotics umbrella. Fortunately, there are plenty of places
                to look in the world for examples that adhere to the definition and characteristics.
              </p>
            </section>
            <section id="natural-inspiration">
              <h3>Natural Inspiration</h3>
              <img src={ants} alt="Six ants carrying leaves in a straight line" />
              <p className="caption">Ants working as a collective swarm. Photo taken by <a href="https://unsplash.com/@jlozanopalacios">John Lozano</a>.</p>
              <p>
                Swarm robotics is heavily inspired by natural swarms like insects, fish, birds, and more. Their unique behaviours of self-organization show their capability to create global system 
                structures from the individual local interactions of the system’s agents.
              </p>
              <p>
                Examples can be seen with insects doing individual actions that combine together to make sophisticated systems or accomplish feats such as creating complex architecture and 
                engineering in the case of insect nests. More examples can be analyzed like termites, ants, and bees. Termites are able to make sophisticated mound structures taller than people. 
                Ants are extremely successful throughout the world and even practice their own agriculture of collecting leaves like with leafcutter ants. Then finally, bees have a unique process 
                for nest selection as a group and can even communicate to each other through their waggle dance, which is what this application was named after.
              </p>
            </section>
            <section id="waggle">
              <h2>Waggle</h2>
              <p>
                The idea for the Waggle web application was conceived by Dr. Andrew Vardy, a professor in the department of computer science and the department of electrical and computer engineering 
                of Memorial University of Newfoundland. This application is an additional project for the Bio-inspired Robotics (BOTS) Lab and was developed by Abigayle Hickey, Christian James, 
                Emily Wiseman, and Nadia Shalaby using Andrew Vardy’s previous iteration of Waggle and Mohammed Abdullhak’s SwarmJS project to guide development for this new version of Waggle, 
                Waggle 2.0.
              </p>
              <p>
                The core concept of Waggle is to serve as an introductory and educational tool for users, students, and teachers for swarm robotics. 
                Although there are other tools out there for simulating swarms of robots such as agent-based simulators like Netlogo and Mason, or robot simulators like ARGoS, V-REP, and Gazebo, 
                Waggle still serves its purpose. The intention behind the design of Waggle is for it to be easier to use than any of the previously mentioned simulators, and sit in a middle 
                ground between being abstract and realistic.
              </p>
            </section>
            <section id="blockly">
              <h2>Blockly</h2>
              <img src={blockly} alt="Example of blockly being used in the browser as a component of a maze game." />
              <p className="caption">Example of blockly being used in the browser from the <a href="https://developers.google.com/blockly">Google Blockly Developers</a> website.</p>
              <p>
                The visual coding elements of Waggle are powered by the <a href="https://developers.google.com/blockly">Blockly library</a>.
                The Blockly library is entirely built around building visual programming apps,
                and it was initially started by Google but has later turned to be open source.
                It has seen wide use for many educational apps, and while it may be seen as
                programming for kids it should also allow those with a more experienced background
                to utilize the visual programming in Waggle to its full potential.
              </p>
            </section>
            <section id="references">
              <h2>References</h2>
              <ol>
                <li><a href="https://link.springer.com/chapter/10.1007/978-3-540-30552-1_2">Şahin, E. (2004). Swarm robotics: From sources of inspiration to domains of application. In International workshop on swarm robotics (pp. 10-20). Springer, Berlin, Heidelberg.</a></li>
                <li><a href="https://link.springer.com/article/10.1007/s11721-012-0075-2">Brambilla, M., Ferrante, E., Birattari, M., &#38; Dorigo, M. (2013). Swarm robotics: a review from the swarm engineering perspective. Swarm Intelligence, 7(1), 1-41.</a></li>
              </ol>
            </section>
            </Container>
          </Grid>
          <Grid item xs={0} lg={3}>
            <Contents />
          </Grid>
        </Grid>
    </div>
  );
}
