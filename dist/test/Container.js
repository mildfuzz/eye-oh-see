"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var Index_1 = require("../src/Index");
var expect = chai.expect;
describe('Registration via attributes', function () {
    var sut;
    beforeEach(function () {
        sut = new Index_1.Container();
    });
    it('should return a new instance when resolving a transient entry', function () {
        // Arrange
        var instanceCount = 0;
        var Foo = (function () {
            function Foo() {
                ++instanceCount;
            }
            Foo = __decorate([
                Index_1.InstancePerDependency(),
                __metadata("design:paramtypes", [])
            ], Foo);
            return Foo;
        }());
        sut.register(Foo);
        // Act
        var instance = sut.resolve(Foo);
        // Assert
        expect(instance instanceof Foo).to.equal(true, "instance should be a Foo but was " + typeof instance);
        expect(instanceCount).to.equal(1);
    });
    it('should construct a new instance for each resolution of a transient entry', function () {
        // Arrange
        var instanceCount = 0;
        var Foo = (function () {
            function Foo() {
                ++instanceCount;
            }
            Foo = __decorate([
                Index_1.InstancePerDependency(),
                __metadata("design:paramtypes", [])
            ], Foo);
            return Foo;
        }());
        // Act
        sut.register(Foo);
        var instanceA = sut.resolve(Foo);
        var instanceB = sut.resolve(Foo);
        // Assert
        expect(instanceA instanceof Foo).to.be.true;
        expect(instanceB instanceof Foo).to.be.true;
        expect(instanceCount).to.equal(2);
        expect(instanceA).to.not.equal(instanceB);
    });
    it('should resolve implementation registered for service when resolving', function () {
        // Arrange
        var IAnimal = (function () {
            function IAnimal() {
            }
            return IAnimal;
        }());
        var Dog = (function () {
            function Dog() {
            }
            Dog = __decorate([
                Index_1.InstancePerDependency(IAnimal)
            ], Dog);
            return Dog;
        }());
        sut.register(IAnimal);
        sut.register(Dog);
        // Arrange
        var instance = sut.resolve(IAnimal);
        // Assert
        expect(instance instanceof Dog).to.be.true;
    });
    it('should allow transient implementations to register as multiple services', function () {
        // Arrange
        var IAnimal = (function () {
            function IAnimal() {
            }
            return IAnimal;
        }());
        var IPet = (function () {
            function IPet() {
            }
            return IPet;
        }());
        var Dog = (function () {
            function Dog() {
            }
            Dog = __decorate([
                Index_1.InstancePerDependency(IAnimal, IPet)
            ], Dog);
            return Dog;
        }());
        sut.register(IAnimal);
        sut.register(IPet);
        sut.register(Dog);
        // Arrange
        var instanceA = sut.resolve(IAnimal);
        var instanceB = sut.resolve(IPet);
        // Assert
        expect(instanceA instanceof Dog).to.be.true;
        expect(instanceB instanceof Dog).to.be.true;
    });
    it('should only construct one instance of a singleton entry', function () {
        // Arrange
        var instanceCount = 0;
        var Foo = (function () {
            function Foo() {
                ++instanceCount;
            }
            Foo = __decorate([
                Index_1.SingleInstance(),
                __metadata("design:paramtypes", [])
            ], Foo);
            return Foo;
        }());
        sut.register(Foo);
        // Act
        var instanceA = sut.resolve(Foo);
        var instanceB = sut.resolve(Foo);
        // Assert
        expect(instanceA instanceof Foo).to.be.true;
        expect(instanceB instanceof Foo).to.be.true;
        expect(instanceCount).to.equal(1);
        expect(instanceA).to.equal(instanceB);
    });
    it('should allow singleton implementations to register as multiple services', function () {
        // Arrange
        var IAnimal = (function () {
            function IAnimal() {
            }
            return IAnimal;
        }());
        var IPet = (function () {
            function IPet() {
            }
            return IPet;
        }());
        var Dog = (function () {
            function Dog() {
            }
            Dog = __decorate([
                Index_1.SingleInstance(IAnimal, IPet)
            ], Dog);
            return Dog;
        }());
        sut.register(IAnimal);
        sut.register(IPet);
        sut.register(Dog);
        // Arrange
        var instanceA = sut.resolve(IAnimal);
        var instanceB = sut.resolve(IPet);
        // Assert
        expect(instanceA instanceof Dog).to.be.true;
        expect(instanceB instanceof Dog).to.be.true;
        expect(instanceA).to.equal(instanceB);
    });
    it('should resolve parameters when resolving an instance', function () {
        // Arrange
        var Bar = (function () {
            function Bar() {
            }
            Bar = __decorate([
                Index_1.InstancePerDependency()
            ], Bar);
            return Bar;
        }());
        var Foo = (function () {
            function Foo(bar) {
                this.bar = bar;
            }
            Foo = __decorate([
                Index_1.InstancePerDependency(),
                __metadata("design:paramtypes", [Bar])
            ], Foo);
            return Foo;
        }());
        sut.register(Bar);
        sut.register(Foo);
        // Act
        var instance = sut.resolve(Foo);
        // Assert
        expect(instance instanceof Foo).to.be.true;
        expect(instance.bar instanceof Bar).to.be.true;
    });
    it('should respect parameters lifetimes when resolving an instance', function () {
        // Arrange
        var barInstanceCount = 0;
        var bazInstanceCount = 0;
        var Bar = (function () {
            function Bar() {
                ++barInstanceCount;
            }
            Bar = __decorate([
                Index_1.SingleInstance(),
                __metadata("design:paramtypes", [])
            ], Bar);
            return Bar;
        }());
        var Baz = (function () {
            function Baz() {
                ++bazInstanceCount;
            }
            Baz = __decorate([
                Index_1.InstancePerDependency(),
                __metadata("design:paramtypes", [])
            ], Baz);
            return Baz;
        }());
        var Foo = (function () {
            function Foo(bar, baz) {
                this.bar = bar;
                this.baz = baz;
            }
            Foo = __decorate([
                Index_1.InstancePerDependency(),
                __metadata("design:paramtypes", [Bar, Baz])
            ], Foo);
            return Foo;
        }());
        sut.register(Foo);
        sut.register(Bar);
        sut.register(Baz);
        // Act
        sut.resolve(Foo);
        sut.resolve(Foo);
        // Assert
        expect(barInstanceCount).to.equal(1);
        expect(bazInstanceCount).to.equal(2);
    });
    it('should resolve registered instances rather than constructing new instances', function () {
        // Arrange
        var instanceCount = 0;
        var Foo = (function () {
            function Foo() {
                ++instanceCount;
            }
            Foo = __decorate([
                Index_1.InstancePerDependency(),
                __metadata("design:paramtypes", [])
            ], Foo);
            return Foo;
        }());
        var instanceA = new Foo();
        sut.register(Foo).resetResolutionStrategy().providedInstance(instanceA);
        // Act
        var instanceB = sut.resolve(Foo);
        // Assert
        expect(instanceB instanceof Foo).to.be.true;
        expect(instanceCount).to.equal(1);
        expect(instanceA).to.equal(instanceB);
    });
    it('should resolve an empty array when there are no registrations for a service injected as an array', function () {
        // Arrange
        var IAnimal = (function () {
            function IAnimal() {
            }
            return IAnimal;
        }());
        var Zoo = (function () {
            function Zoo(animals) {
                this.animals = animals;
            }
            Zoo = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.ArrayOf(IAnimal)),
                __metadata("design:paramtypes", [Array])
            ], Zoo);
            return Zoo;
        }());
        sut.register(IAnimal);
        sut.register(Zoo);
        // Act
        var instance = sut.resolve(Zoo);
        // Assert
        expect(instance.animals.length).to.equal(0);
    });
    it('should resolve all registrations for a service when resolving an array', function () {
        // Arrange
        var IAnimal = (function () {
            function IAnimal() {
            }
            return IAnimal;
        }());
        var Dog = (function () {
            function Dog() {
            }
            Dog = __decorate([
                Index_1.InstancePerDependency(IAnimal)
            ], Dog);
            return Dog;
        }());
        var Cat = (function () {
            function Cat() {
            }
            Cat = __decorate([
                Index_1.InstancePerDependency(IAnimal)
            ], Cat);
            return Cat;
        }());
        var Zoo = (function () {
            function Zoo(animals) {
                this.animals = animals;
            }
            Zoo = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.ArrayOf(IAnimal)),
                __metadata("design:paramtypes", [Array])
            ], Zoo);
            return Zoo;
        }());
        sut.register(IAnimal);
        sut.register(Dog);
        sut.register(Cat);
        sut.register(Zoo);
        // Act
        var instance = sut.resolve(Zoo);
        // Assert
        expect(instance.animals.length).to.equal(2);
        expect(instance.animals[0] instanceof Dog).to.be.true;
        expect(instance.animals[1] instanceof Cat).to.be.true;
    });
    it('should respect lifetime registrations when resolving arrays', function () {
        // Arrange
        var dogInstanceCount = 0;
        var IAnimal = (function () {
            function IAnimal() {
            }
            return IAnimal;
        }());
        var Dog = (function () {
            function Dog() {
                ++dogInstanceCount;
            }
            Dog = __decorate([
                Index_1.SingleInstance(IAnimal),
                __metadata("design:paramtypes", [])
            ], Dog);
            return Dog;
        }());
        var Cat = (function () {
            function Cat() {
            }
            Cat = __decorate([
                Index_1.InstancePerDependency(IAnimal)
            ], Cat);
            return Cat;
        }());
        var Zoo = (function () {
            function Zoo(animals) {
                this.animals = animals;
            }
            Zoo = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.ArrayOf(IAnimal)),
                __metadata("design:paramtypes", [Array])
            ], Zoo);
            return Zoo;
        }());
        sut.register(IAnimal);
        sut.register(Dog);
        sut.register(Cat);
        sut.register(Zoo);
        // Act
        sut.resolve(Zoo);
        sut.resolve(Zoo);
        // Assert
        expect(dogInstanceCount).to.equal(1);
    });
    it('should inject factories where the factory attribute is used', function () {
        // Arrange
        var Foo = (function () {
            function Foo() {
            }
            Foo = __decorate([
                Index_1.InstancePerDependency()
            ], Foo);
            return Foo;
        }());
        var Bar = (function () {
            function Bar(factory) {
                this.a = factory();
                this.b = factory();
            }
            Bar = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.Factory(Foo)),
                __metadata("design:paramtypes", [Function])
            ], Bar);
            return Bar;
        }());
        sut.register(Foo);
        sut.register(Bar);
        // Act
        var instance = sut.resolve(Bar);
        // Assert
        expect(instance.a instanceof Foo).to.be.true;
        expect(instance.b instanceof Foo).to.be.true;
        expect(instance.a === instance.b).to.be.false;
    });
    it('should respect the lifetime registrations when resolving through factories', function () {
        // Arrange
        var instanceCount = 0;
        var Foo = (function () {
            function Foo() {
                ++instanceCount;
            }
            Foo = __decorate([
                Index_1.SingleInstance(),
                __metadata("design:paramtypes", [])
            ], Foo);
            return Foo;
        }());
        var Bar = (function () {
            function Bar(factory) {
                this.a = factory();
                this.b = factory();
            }
            Bar = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.Factory(Foo)),
                __metadata("design:paramtypes", [Function])
            ], Bar);
            return Bar;
        }());
        sut.register(Foo);
        sut.register(Bar);
        // Act
        sut.resolve(Bar);
        // Assert
        expect(instanceCount).to.equal(1);
    });
    it('should respect per scope container registrations when resolving through factories', function () {
        // Arrange
        var instanceCount = 0;
        var MyScope = 'MyScope';
        var Leaf = (function () {
            function Leaf() {
                ++instanceCount;
            }
            Leaf = __decorate([
                Index_1.InstancePerScope(MyScope),
                __metadata("design:paramtypes", [])
            ], Leaf);
            return Leaf;
        }());
        var Lv1 = (function () {
            function Lv1(a, b) {
                this.a = a;
                this.b = b;
            }
            Lv1 = __decorate([
                Index_1.InstancePerDependency(),
                __metadata("design:paramtypes", [Leaf, Leaf])
            ], Lv1);
            return Lv1;
        }());
        var Lv2 = (function () {
            function Lv2(lv1Factory, lv1FactoryScoped) {
                this.lv1Factory = lv1Factory;
                this.lv1FactoryScoped = lv1FactoryScoped;
                this.a = lv1Factory();
                this.b = lv1Factory();
                this.c = lv1FactoryScoped();
            }
            Lv2 = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.Factory(Lv1)),
                __param(1, Index_1.ScopedFactory(MyScope, Lv1)),
                __metadata("design:paramtypes", [Function, Function])
            ], Lv2);
            return Lv2;
        }());
        var Root = (function () {
            function Root(factory) {
                this.a = factory();
                this.b = factory();
            }
            Root = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.ScopedFactory(MyScope, Lv2)),
                __metadata("design:paramtypes", [Function])
            ], Root);
            return Root;
        }());
        sut.register(Leaf);
        sut.register(Lv1);
        sut.register(Lv2);
        sut.register(Root);
        // Act
        sut.resolve(Root);
        // Assert
        expect(instanceCount).to.equal(4);
        // Details:
        // a->a->a: instance #1
        // a->a->b: instance #1
        // a->b->a: instance #1
        // a->b->b: instance #1
        // a->c->a: instance #2
        // a->c->b: instance #2
        // b->a->a: instance #3
        // b->a->b: instance #3
        // b->b->a: instance #3
        // b->b->b: instance #3
        // b->c->a: instance #4
        // b->c->b: instance #4
    });
    it('should respect per scope container registrations when resolving units of work', function () {
        // Arrange
        var instanceCount = 0;
        var MyScope = 'MyScope';
        var Leaf = (function () {
            function Leaf() {
                ++instanceCount;
            }
            Leaf = __decorate([
                Index_1.InstancePerScope(MyScope),
                __metadata("design:paramtypes", [])
            ], Leaf);
            return Leaf;
        }());
        var Lv1 = (function () {
            function Lv1(a, b) {
                this.a = a;
                this.b = b;
            }
            Lv1 = __decorate([
                Index_1.InstancePerDependency(),
                __metadata("design:paramtypes", [Leaf, Leaf])
            ], Lv1);
            return Lv1;
        }());
        var Lv2 = (function () {
            function Lv2(lv1Factory, lv1FactoryScoped) {
                this.lv1Factory = lv1Factory;
                this.lv1FactoryScoped = lv1FactoryScoped;
                this.a = lv1Factory().value;
                this.b = lv1Factory().value;
                this.c = lv1FactoryScoped().value;
            }
            Lv2 = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.UnitOfWork(Lv1)),
                __param(1, Index_1.ScopedUnitOfWork(MyScope, Lv1)),
                __metadata("design:paramtypes", [Function, Function])
            ], Lv2);
            return Lv2;
        }());
        var Root = (function () {
            function Root(factory) {
                this.a = factory().value;
                this.b = factory().value;
            }
            Root = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.ScopedUnitOfWork(MyScope, Lv2)),
                __metadata("design:paramtypes", [Function])
            ], Root);
            return Root;
        }());
        sut.register(Leaf);
        sut.register(Lv1);
        sut.register(Lv2);
        sut.register(Root);
        // Act
        sut.resolve(Root);
        // Assert
        expect(instanceCount).to.equal(4);
        // Details:
        // a->a->a: instance #1
        // a->a->b: instance #1
        // a->b->a: instance #1
        // a->b->b: instance #1
        // a->c->a: instance #2
        // a->c->b: instance #2
        // b->a->a: instance #3
        // b->a->b: instance #3
        // b->b->a: instance #3
        // b->b->b: instance #3
        // b->c->a: instance #4
        // b->c->b: instance #4
    });
    it('should resolve descendants with arguments provided to factories', function () {
        // Arrange
        var Color = (function () {
            function Color() {
            }
            Color.Red = new Color();
            Color.Green = new Color();
            return Color;
        }());
        var Knee = (function () {
            function Knee(color) {
                this.color = color;
            }
            Knee = __decorate([
                Index_1.InstancePerDependency(),
                __metadata("design:paramtypes", [Color])
            ], Knee);
            return Knee;
        }());
        var Leg = (function () {
            function Leg(knee) {
                this.knee = knee;
            }
            Leg = __decorate([
                Index_1.InstancePerDependency(),
                __metadata("design:paramtypes", [Knee])
            ], Leg);
            return Leg;
        }());
        var Robot = (function () {
            function Robot(factory) {
                this.left = factory(Color.Red);
                this.right = factory(Color.Green);
            }
            Robot = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.Factory(Color, Leg)),
                __metadata("design:paramtypes", [Function])
            ], Robot);
            return Robot;
        }());
        sut.register(Knee);
        sut.register(Leg);
        sut.register(Robot);
        // Act
        var instance = sut.resolve(Robot);
        // Assert
        expect(instance.left.knee.color).to.equal(Color.Red);
        expect(instance.right.knee.color).to.equal(Color.Green);
        expect(instance.left.knee.color).to.not.equal(instance.right.knee.color);
    });
    it('should override existing registrations when factory is provided with a parameter', function () {
        // Arrange
        var Param = (function () {
            function Param() {
            }
            Param = __decorate([
                Index_1.InstancePerDependency()
            ], Param);
            return Param;
        }());
        var Config = (function () {
            function Config() {
            }
            Config = __decorate([
                Index_1.InstancePerDependency()
            ], Config);
            return Config;
        }());
        var App = (function () {
            function App(factory) {
                this.config = factory(new Param());
            }
            App = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.Factory(Param, Config)),
                __metadata("design:paramtypes", [Function])
            ], App);
            return App;
        }());
        sut.register(Param); // Param exists as a transient in the global scope
        sut.register(Config);
        sut.register(App); // But it is also provided via a factory here
        // Act + Assert (no throw)
        sut.resolve(App);
    });
    it('should dispose of transient resources when the container is disposed', function () {
        // Arrange
        var disposeCount = 0;
        var Foo = (function () {
            function Foo() {
            }
            Foo.prototype.dispose = function () {
                ++disposeCount;
            };
            Foo = __decorate([
                Index_1.InstancePerDependency(),
                Index_1.Disposable()
            ], Foo);
            return Foo;
        }());
        sut.register(Foo);
        sut.resolve(Foo);
        sut.resolve(Foo);
        // Act
        sut.dispose();
        // Assert
        expect(disposeCount).to.equal(2);
    });
    it('should dispose of singleton resources when the container is disposed', function () {
        // Arrange
        var disposeCount = 0;
        var Foo = (function () {
            function Foo() {
            }
            Foo.prototype.dispose = function () {
                ++disposeCount;
            };
            Foo = __decorate([
                Index_1.SingleInstance(),
                Index_1.Disposable()
            ], Foo);
            return Foo;
        }());
        sut.register(Foo);
        sut.resolve(Foo);
        sut.resolve(Foo);
        // Act
        sut.dispose();
        // Assert
        expect(disposeCount).to.equal(1);
    });
    it('should dispose of resources created through factories when the container is disposed', function () {
        // Arrange
        var disposeCount = 0;
        var Foo = (function () {
            function Foo() {
            }
            Foo.prototype.dispose = function () {
                ++disposeCount;
            };
            Foo = __decorate([
                Index_1.InstancePerDependency(),
                Index_1.Disposable()
            ], Foo);
            return Foo;
        }());
        var FooFactory = (function () {
            function FooFactory(factory) {
                this.factory = factory;
            }
            FooFactory.prototype.create = function () {
                return this.factory();
            };
            FooFactory = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.Factory(Foo)),
                __metadata("design:paramtypes", [Function])
            ], FooFactory);
            return FooFactory;
        }());
        sut.register(Foo);
        sut.register(FooFactory);
        var factoryInstance = sut.resolve(FooFactory);
        factoryInstance.create();
        factoryInstance.create();
        // Act
        sut.dispose();
        // Assert
        expect(disposeCount).to.equal(2);
    });
    it('should dispose of transitively owned resources when a unit of work is disposed', function () {
        // Arrange
        var disposeCount = 0;
        var OwnedResource = (function () {
            function OwnedResource() {
            }
            OwnedResource.prototype.dispose = function () {
                ++disposeCount;
            };
            OwnedResource = __decorate([
                Index_1.InstancePerDependency(),
                Index_1.Disposable()
            ], OwnedResource);
            return OwnedResource;
        }());
        var MyWorkManager = (function () {
            function MyWorkManager(workFactory) {
                this.unitOfWork = workFactory();
            }
            MyWorkManager = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.UnitOfWork(OwnedResource)),
                __metadata("design:paramtypes", [Function])
            ], MyWorkManager);
            return MyWorkManager;
        }());
        sut.register(OwnedResource);
        sut.register(MyWorkManager);
        var instance = sut.resolve(MyWorkManager);
        // Act
        instance.unitOfWork.dispose();
        // Assert
        expect(disposeCount).to.equal(1);
    });
    it('should not dispose of non-owned resources, e.g., singletons, when a unit of work is disposed', function () {
        // Arrange
        var disposeCount = 0;
        var NotOwnedResource = (function () {
            function NotOwnedResource() {
            }
            NotOwnedResource.prototype.dispose = function () {
                ++disposeCount;
            };
            NotOwnedResource = __decorate([
                Index_1.SingleInstance(),
                Index_1.Disposable()
            ], NotOwnedResource);
            return NotOwnedResource;
        }());
        var MyWorkManager = (function () {
            function MyWorkManager(workFactory) {
                this.unitOfWork = workFactory();
            }
            MyWorkManager = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.UnitOfWork(NotOwnedResource)),
                __metadata("design:paramtypes", [Function])
            ], MyWorkManager);
            return MyWorkManager;
        }());
        sut.register(NotOwnedResource);
        sut.register(MyWorkManager);
        var instance = sut.resolve(MyWorkManager);
        // Act
        instance.unitOfWork.dispose();
        // Assert
        expect(disposeCount).to.equal(0);
    });
    it('should dispose of nested child containers when an ancestor is disposed', function () {
        // Arrange
        var disposeCount = 0;
        var OwnedResource = (function () {
            function OwnedResource() {
            }
            OwnedResource.prototype.dispose = function () {
                ++disposeCount;
            };
            OwnedResource = __decorate([
                Index_1.InstancePerDependency(),
                Index_1.Disposable()
            ], OwnedResource);
            return OwnedResource;
        }());
        var MyWorkManager = (function () {
            function MyWorkManager(workFactory) {
                this.unitOfWork = workFactory();
            }
            MyWorkManager = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.UnitOfWork(OwnedResource)),
                __metadata("design:paramtypes", [Function])
            ], MyWorkManager);
            return MyWorkManager;
        }());
        var MyOuterWorkManager = (function () {
            function MyOuterWorkManager(workFactory) {
                this.unitOfWork = workFactory();
            }
            MyOuterWorkManager = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.UnitOfWork(MyWorkManager)),
                __metadata("design:paramtypes", [Function])
            ], MyOuterWorkManager);
            return MyOuterWorkManager;
        }());
        sut.register(OwnedResource);
        sut.register(MyWorkManager);
        sut.register(MyOuterWorkManager);
        var instance = sut.resolve(MyOuterWorkManager);
        // Act
        instance.unitOfWork.dispose();
        // Assert
        expect(disposeCount).to.equal(1);
    });
    it('should resolve descendants with arguments passed to unit of work factory', function () {
        // Arrange
        var Color = (function () {
            function Color() {
            }
            Color.Blue = new Color();
            return Color;
        }());
        var OwnedResource = (function () {
            function OwnedResource(color) {
                this.color = color;
            }
            OwnedResource = __decorate([
                Index_1.InstancePerDependency(),
                __metadata("design:paramtypes", [Color])
            ], OwnedResource);
            return OwnedResource;
        }());
        var MyWorkManager = (function () {
            function MyWorkManager(workFactory) {
                this.unitOfWork = workFactory(Color.Blue);
            }
            MyWorkManager = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.UnitOfWork(Color, OwnedResource)),
                __metadata("design:paramtypes", [Function])
            ], MyWorkManager);
            return MyWorkManager;
        }());
        sut.register(OwnedResource);
        sut.register(MyWorkManager);
        // Act
        var instance = sut.resolve(MyWorkManager);
        // Assert
        expect(instance.unitOfWork.value.color).to.equal(Color.Blue);
    });
    it('should be possible to determine whether an object is registered via an annotation or not', function () {
        // Arrange
        var Foo = (function () {
            function Foo() {
            }
            Foo = __decorate([
                Index_1.SingleInstance()
            ], Foo);
            return Foo;
        }());
        var Bar = (function () {
            function Bar() {
            }
            Bar = __decorate([
                Index_1.InstancePerDependency()
            ], Bar);
            return Bar;
        }());
        var Baz = (function () {
            function Baz() {
            }
            return Baz;
        }());
        // Act
        var isFooAnnotated = Index_1.hasRegistrationAnnotation(Foo);
        var isBarAnnotated = Index_1.hasRegistrationAnnotation(Bar);
        var isBazAnnotated = Index_1.hasRegistrationAnnotation(Baz);
        // Assert
        expect(isFooAnnotated).to.be.true;
        expect(isBarAnnotated).to.be.true;
        expect(isBazAnnotated).to.be.false;
    });
    it('should be possible to register a type in multiple containers', function () {
        // Arrange
        var otherSut = new Index_1.Container();
        var Foo = (function () {
            function Foo() {
            }
            Foo = __decorate([
                Index_1.InstancePerDependency()
            ], Foo);
            return Foo;
        }());
        // Act
        sut.register(Foo);
        otherSut.register(Foo);
        // Assert
        expect(sut.resolve(Foo)).is.instanceof(Foo);
        expect(otherSut.resolve(Foo)).is.instanceof(Foo);
    });
    it('should ignore base class registrations', function () {
        // Arrange
        var Super = (function () {
            function Super() {
            }
            Super = __decorate([
                Index_1.InstancePerDependency()
            ], Super);
            return Super;
        }());
        var Foo = (function (_super) {
            __extends(Foo, _super);
            function Foo() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Foo = __decorate([
                Index_1.SingleInstance()
            ], Foo);
            return Foo;
        }(Super));
        // Act
        sut.register(Super);
        sut.register(Foo);
        // Assert
        expect(sut.resolve(Foo)).equals(sut.resolve(Foo));
    });
    it('should allow registering a singleton of a base type and itself', function () {
        // Arrange
        var Super = (function () {
            function Super() {
            }
            Super.prototype.test = function () { return 1; };
            return Super;
        }());
        var Service = (function () {
            function Service() {
            }
            Service_1 = Service;
            Service.prototype.test = function () { return 2; };
            Service = Service_1 = __decorate([
                Index_1.SingleInstance(Super, Service_1) // NOTE: Registration as self here is not necessary. It will cause a warning.
            ], Service);
            return Service;
            var Service_1;
        }());
        var ConsumerA = (function () {
            function ConsumerA(service) {
                this.service = service;
            }
            ConsumerA.prototype.test = function () { return this.service.test(); };
            ConsumerA = __decorate([
                Index_1.InstancePerDependency(),
                __metadata("design:paramtypes", [Service])
            ], ConsumerA);
            return ConsumerA;
        }());
        var ConsumerB = (function () {
            function ConsumerB(service) {
                this.service = service;
            }
            ConsumerB.prototype.test = function () { return this.service.test(); };
            ConsumerB = __decorate([
                Index_1.InstancePerDependency(),
                __metadata("design:paramtypes", [Super])
            ], ConsumerB);
            return ConsumerB;
        }());
        sut.register(Service);
        sut.register(ConsumerA);
        sut.register(ConsumerB);
        // Act
        var a = sut.resolve(ConsumerA);
        var b = sut.resolve(ConsumerB);
        // Assert
        expect(a.test()).equals(2);
        expect(b.test()).equals(2);
    });
    it('should allow resolution as self when registered as a base type', function () {
        // Arrange
        var Super = (function () {
            function Super() {
            }
            Super.prototype.test = function () { return 1; };
            return Super;
        }());
        var Service = (function () {
            function Service() {
            }
            Service.prototype.test = function () { return 2; };
            Service = __decorate([
                Index_1.SingleInstance(Super)
            ], Service);
            return Service;
        }());
        var Consumer = (function () {
            function Consumer(factory) {
                this.factory = factory;
            }
            Consumer.prototype.test = function () {
                var instance = this.factory();
                return instance.test();
            };
            Consumer = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.Factory(Service)),
                __metadata("design:paramtypes", [Function])
            ], Consumer);
            return Consumer;
        }());
        // Act
        sut.register(Service);
        sut.register(Consumer);
        var consumer = sut.resolve(Consumer);
        var result = consumer.test();
        // Assert
        expect(result).equals(2);
    });
    it('should allow the user to override the parameter type using ParamOf', function () {
        // Arrange
        var Service = (function () {
            function Service() {
            }
            Service = __decorate([
                Index_1.InstancePerDependency()
            ], Service);
            return Service;
        }());
        var Consumer = (function () {
            function Consumer(service) {
                this.service = service;
            }
            Consumer = __decorate([
                Index_1.InstancePerDependency(),
                __param(0, Index_1.ParamOf(Service)),
                __metadata("design:paramtypes", [Object])
            ], Consumer);
            return Consumer;
        }());
        // Act
        sut.register(Service);
        sut.register(Consumer);
        var consumer = sut.resolve(Consumer);
        // Assert
        expect(consumer.service instanceof Service).to.be.true;
    });
    it('should allow registration after extends has been called in generated code', function () {
        // Context:
        //   When a class extends another in TypeScript the static enumerable properties are copied
        //   from the super type to the sub type. As we store metadata on the constructor functions
        //   this can cause issues when registering classes that are defined and extended in another
        //   module.
        // Arrange
        var Service = (function () {
            function Service() {
            }
            return Service;
        }());
        function moduleA(container) {
            var ServiceImplA = (function (_super) {
                __extends(ServiceImplA, _super);
                function ServiceImplA() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.name = 'a';
                    return _this;
                }
                ServiceImplA = __decorate([
                    Index_1.SingleInstance(Service)
                ], ServiceImplA);
                return ServiceImplA;
            }(Service));
            container.register(ServiceImplA);
        }
        function moduleB(container) {
            var ServiceImplB = (function (_super) {
                __extends(ServiceImplB, _super);
                function ServiceImplB() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.name = 'b';
                    return _this;
                }
                ServiceImplB = __decorate([
                    Index_1.SingleInstance(Service)
                ], ServiceImplB);
                return ServiceImplB;
            }(Service));
            container.register(ServiceImplB);
        }
        // Act
        sut.register(Service);
        moduleA(sut);
        moduleB(sut);
        var impls = sut.resolveManyAbstract(Service);
        // Assert
        var names = impls.map(function (impl) { return impl.name; });
        expect(names).to.deep.equal(['a', 'b']);
    });
});
